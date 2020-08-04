import { Parser } from './parser';

export interface StringParserConfig {
    trimString: boolean;
}

export const stringParser: Parser<string, StringParserConfig> = {

    defaultConfig: {
        trimString: true,
    },

    parse: (value, config) => {

        if (typeof value === 'string') {
            return {
                success: true,
                value: config?.trimString ? value.trim() : value,
            };
        }

        return { success: false };
    }
};
