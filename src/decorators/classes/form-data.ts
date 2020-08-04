import {registerParser, hasParser, getParserFor} from '../../registries/types-registry';
import {Parser} from '../../parsers';
import {addFormFieldInfo, getPropertyTypeOf, getFormFieldsInfo, FormFieldInfo} from '../../metadata';

export function Form<T extends {new(...args: any[]): {}}>(constructor: T): void {
    const result = Reflect.getOwnMetadata('design:paramtypes', constructor);

    if (result?.length) {
        throw new Error(`The constructor for class ${constructor.name} MUST NOT take arguments.`);
    }

    const fields = getFormFieldsInfo(constructor.prototype);
    const composedParsers = composeParsersOfFields(fields);
    const parser: Parser<any> = {
        parse: (value) => {
            const instance: any = new constructor();
            const midResult = composedParsers.parse(value);
            if (midResult.success) {
                return { success: true, value: Object.assign(instance, midResult.value) };
            }
            return { success: false };
        }
    };

    registerParser(constructor.name, parser);
}

function composeParsersOfFields(fields: FormFieldInfo[]): Parser<any> {
    const fieldsData = fetchParserForEachField(fields);

    return {
        parse: (value) => {
            if (typeof value !== 'object') {
                return { success: false };
            }

            const resultingValue: any = {};

            for (const fieldData of fieldsData) {
                const parserResult = fieldData.parser.parse(value[fieldData.id], fieldData.parser.defaultConfig);
                if (parserResult.success) {
                    resultingValue[fieldData.property] = parserResult.value;
                } else {
                    return { success: false };
                }
            }

            return { success: true, value: resultingValue };
        }
    };
}

function fetchParserForEachField(fields: FormFieldInfo[]) {
    return fields.map((field => {
        if (!hasParser(field.type)) {
            throw new Error(`Unable to find a parser for type: ${field.type}`);
        }
        return {
            property: field.propertyName,
            id: field.id,
            parser: getParserFor(field.type)
        };
    }));
}

export function Field(id?: string): Function {
    return function(target: any, property: string): void {
        /* Checks if the given id is not empty */
        if (id && id.length === 0) {
            throw new Error(`Id for property ${property} MUST NOT be empty.`);
        }

        /* Try to retrieve field type */
        const typename = getPropertyTypeOf(target, property);
        if (typename === undefined) {
            throw new Error(`Unable to determinate type for property ${property} of class ${target}.`);
        }

        /* Add field info to class metadata */
        addFormFieldInfo(target, { 
            id: id || property,
            propertyName: property,
            type: typename
        });
    };
}
