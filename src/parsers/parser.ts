export type ParserResult<T> = { success: true; value: T } | { success: false };

export interface Parser<T, Config = {}> {

    defaultConfig?: Config;

    parse(value: any, config?: Config): ParserResult<T>;
}
