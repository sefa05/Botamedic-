declare var process: {
  env: Record<string, string | undefined>;
};

declare var console: Console;

interface Console {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
}

export {};
