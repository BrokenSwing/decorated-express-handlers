import { Parser, stringParser, integerParser } from '../parsers';

const parsers: {[typename: string]: Parser<any, any> } = {
    'Number': integerParser,
    'String': stringParser,
};

/**
 * Registers a parser for a type. 
 * WARNING: You can't register two parsers for the same type name.
 * WARNING: You can't register parsers for native classes (Number, String, Object, Array, Boolean)
 * 
 * @param typename The type to register a parser for
 * @param parser The parser for the given type
 */
export function registerParser(typename: string, parser: Parser<any, any>): void {

    if (isForbiddenType(typename)) {
        throw new Error(`Typename ${typename} is not allowed. Please choose an other class name.`);
    }

    if (hasParser(typename)) {
        throw new Error(`Unable to set type ${typename} as a FormData type because one with the same name already exists.`);
    }

    parsers[typename] = parser;
}

function isForbiddenType(typename: string): boolean {
    return ['Number', 'String', 'Object', 'Array', 'Boolean'].includes(typename);
}

/**
 * Retrieves the parser for the given type.
 * 
 * @param typename The type to get parser for
 */
export function getParserFor(typename: string): Parser<any> {
    return parsers[typename];
}

/**
 * Checks if a parser exists for the given type.
 * 
 * @param typename The typename to check the presence of a parser for
 */
export function hasParser(typename: string): boolean {
    return parsers[typename] !== undefined;
}
