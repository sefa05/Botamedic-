const isBrowser = () => typeof window !== 'undefined';

const parseProjectRef = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname.split('.')[0];
  } catch (error) {
    console.warn('[supabase-js-local] Failed to parse project ref', error);
    return '';
  }
};

const encodeFilterValue = (value) => {
  if (value === null) {
    return 'is.null';
  }
  return `eq.${String(value)}`;
};

const encodeRangeValue = (operator, value) => `${operator}.${String(value)}`;

class PostgrestQueryBuilder {
  constructor(client, table) {
    this.client = client;
    this.table = table;
    this.filters = [];
    this.orders = [];
    this.shouldReturnSingle = false;
  }

  eq(column, value) {
    this.filters.push({ column, value: encodeFilterValue(value) });
    return this;
  }

  gte(column, value) {
    this.filters.push({ column, value: encodeRangeValue('gte', value) });
    return this;
  }

  order(column, options = {}) {
    this.orders.push({ column, ascending: options.ascending !== false });
    return this;
  }

  single() {
    this.shouldReturnSingle = true;
    return this;
  }

  async select(columns = '*') {
    const url = this.#buildUrl();
    url.searchParams.set('select', columns);
    return this.#request(url, 'GET');
  }

  async insert(values) {
    const url = this.#buildUrl();
    return this.#request(url, 'POST', values);
  }

  async update(values) {
    const url = this.#buildUrl();
    return this.#request(url, 'PATCH', values);
  }

  #buildUrl() {
    const url = new URL(`${this.client.url}/rest/v1/${this.table}`);
    this.filters.forEach((filter) => {
      url.searchParams.append(filter.column, filter.value);
    });
    this.orders.forEach((order) => {
      const direction = order.ascending ? 'asc' : 'desc';
      url.searchParams.append('order', `${order.column}.${direction}`);
    });
    return url;
  }

  async #request(url, method, body) {
    const headers = this.client.restHeaders();
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      headers['Prefer'] = 'return=representation';
    }
    if (this.shouldReturnSingle) {
      headers['Accept'] = 'application/vnd.pgrst.object+json';
    }

    const shouldWrapArray = method === 'POST';
    let payload;
    if (body !== undefined) {
      const normalized = Array.isArray(body) || !shouldWrapArray ? body : [body];
      payload = JSON.stringify(normalized);
    }
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: payload
    });

    this.shouldReturnSingle = false;

    if (response.status === 204) {
      return { data: null, error: null };
    }

    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const message = data?.message || data?.error_description || data?.error || 'PostgREST request failed';
      return { data: null, error: new Error(message) };
    }

    return { data, error: null };
  }
}

class SupabaseAuthClient {
  constructor(client, cookieName) {
    this.client = client;
    this.cookieName = cookieName;
  }

  async signInWithPassword({ email, password }) {
    const { data, error } = await this.#authRequest(`/auth/v1/token?grant_type=password`, {
      method: 'POST',
      body: { email, password }
    });
    if (error) {
      return { data: { user: null, session: null }, error };
    }
    this.#persistSession(data);
    return { data: { user: data.user ?? null, session: data }, error: null };
  }

  async signUp({ email, password }) {
    const { data, error } = await this.#authRequest(`/auth/v1/signup`, {
      method: 'POST',
      body: { email, password }
    });
    if (error) {
      return { data: { user: null, session: null }, error };
    }
    if (data.session) {
      this.#persistSession(data.session);
    }
    return { data: { user: data.user ?? null, session: data.session ?? null }, error: null };
  }

  async getUser() {
    if (!this.client.accessToken) {
      return { data: { user: null }, error: new Error('Not authenticated') };
    }
    const { data, error } = await this.#authRequest(`/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.client.accessToken}`
      }
    });
    if (error) {
      return { data: { user: null }, error };
    }
    return { data: { user: data }, error: null };
  }

  async #authRequest(path, { method, body, headers = {} }) {
    const response = await fetch(`${this.client.url}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        apikey: this.client.key,
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const message = data?.message || data?.error_description || data?.error || 'Auth request failed';
      return { data: null, error: new Error(message) };
    }

    return { data, error: null };
  }

  #persistSession(session) {
    this.client.accessToken = session?.access_token;
    if (!this.client.persistSession || !this.cookieName || !isBrowser()) {
      return;
    }
    const payload = JSON.stringify({ currentSession: session, access_token: session?.access_token });
    try {
      window.localStorage?.setItem(this.cookieName, payload);
    } catch (error) {
      console.warn('[supabase-js-local] Failed to persist session to localStorage', error);
    }
    try {
      document.cookie = `${this.cookieName}=${encodeURIComponent(payload)}; path=/; max-age=${session?.expires_in ?? 3600}`;
    } catch (error) {
      console.warn('[supabase-js-local] Failed to persist session cookie', error);
    }
  }
}

class SupabaseLikeClient {
  constructor(url, key, options = {}) {
    this.url = url?.replace(/\/$/, '');
    this.key = key;
    this.accessToken = undefined;
    this.persistSession = options.auth?.persistSession ?? false;
    const authorization = options.global?.headers?.Authorization;
    if (authorization?.startsWith('Bearer ')) {
      this.accessToken = authorization.slice(7);
    }
    const projectRef = parseProjectRef(this.url);
    this.cookieName = projectRef ? `sb-${projectRef}-auth-token` : undefined;
    this.auth = new SupabaseAuthClient(this, this.cookieName);
  }

  restHeaders() {
    return {
      apikey: this.key,
      Authorization: `Bearer ${this.accessToken ?? this.key}`
    };
  }

  from(table) {
    return new PostgrestQueryBuilder(this, table);
  }
}

export function createClient(url, key, options = {}) {
  return new SupabaseLikeClient(url, key, options);
}
