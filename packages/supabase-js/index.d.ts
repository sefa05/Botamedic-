export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

export interface PostgrestQueryBuilder<T = any> {
  eq(column: string, value: any): PostgrestQueryBuilder<T>;
  gte(column: string, value: any): PostgrestQueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): PostgrestQueryBuilder<T>;
  single(): PostgrestQueryBuilder<T>;
  select(columns?: string): Promise<SupabaseResponse<T>>;
  insert(values: any): Promise<SupabaseResponse<T>>;
  update(values: any): Promise<SupabaseResponse<T>>;
}

export interface SupabaseAuthApi {
  signInWithPassword(credentials: { email: string; password: string }): Promise<SupabaseResponse<{ user: any; session: any }>>;
  signUp(credentials: { email: string; password: string }): Promise<SupabaseResponse<{ user: any; session: any }>>;
  getUser(): Promise<SupabaseResponse<any>>;
}

export interface SupabaseClient<Database = any> {
  auth: SupabaseAuthApi;
  from(table: keyof Database | string): PostgrestQueryBuilder<any>;
}

export interface SupabaseClientOptions {
  auth?: {
    persistSession?: boolean;
    detectSessionInUrl?: boolean;
  };
  global?: {
    headers?: Record<string, string>;
  };
}

export declare function createClient<Database = any>(
  url: string,
  key: string,
  options?: SupabaseClientOptions
): SupabaseClient<Database>;
