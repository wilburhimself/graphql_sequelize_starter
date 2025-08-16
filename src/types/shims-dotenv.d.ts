declare module 'dotenv' {
  export interface DotenvConfigOptions {
    path?: string;
    encoding?: string;
    debug?: boolean;
  }
  export interface DotenvConfigOutput {
    parsed?: Record<string, string>;
    error?: Error;
  }
  export function config(options?: DotenvConfigOptions): DotenvConfigOutput;
  const _default: { config: typeof config };
  export default _default;
}
