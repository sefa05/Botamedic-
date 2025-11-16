export as namespace React;

export type ReactNode = any;
export type ReactElement = any;
export type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;
export type PropsWithChildren<P> = P & { children?: ReactNode };
export interface CSSProperties {
  [key: string]: string | number | undefined;
}

export interface HTMLAttributes<T> {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  [key: string]: any;
}

export type DetailedHTMLProps<E, T> = E & T;

export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (event: any) => void;
  placeholder?: string;
  name?: string;
}

export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
  action?: string;
  method?: string;
}

export const Fragment: any;

export function useState<S>(initial: S | (() => S)): [S, (value: S) => void];
export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
export function useReducer<R extends (state: any, action: any) => any>(
  reducer: R,
  initialState: Parameters<R>[0]
): [ReturnType<R>, (action: Parameters<R>[1]) => void];
export function useContext<T>(context: any): T;
export function createContext<T>(defaultValue: T): any;
export function useMemo<T>(factory: () => T, deps: any[]): T;
export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;

declare global {
  namespace JSX {
    type Element = ReactElement;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
