import { Parser } from './parser';

export interface IntegerParserConfig {
    convertFloatToInteger: boolean;
    parseFromString: boolean;
}

export const integerParser: Parser<number, IntegerParserConfig> = {

    defaultConfig: {
        convertFloatToInteger: false,
        parseFromString: true,
    },

    parse: (value, config) => {
        if (typeof value === 'string' && config?.parseFromString) {
            value = parseInt(value, 10);
        }

        if (typeof value === 'number' && !isNaN(value)) {
            
            if (`${value}`.indexOf('.') === -1 || config?.convertFloatToInteger) {
                return { success: true, value: value | 0 };
            }
        }

        return { success: false };
    }
};
