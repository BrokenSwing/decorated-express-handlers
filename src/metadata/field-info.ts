/**
 * The metadata key for form field information.
 */
export const FORM_FIELD_INFO_METADATA = Symbol('formField');

/**
 * Information about a form field.
 * Attributes:
 *  - id: the name for this field in the received form
 *  - propertyName: the property to store field value in
 *  - type: the type of the property
 */
export interface FormFieldInfo {
    id: string;
    propertyName: string;
    type: string;
}

/**
 * Retrieves form fields information for the given class.
 * If no information exists, it returns an empty array.
 *
 * @param target The target class
 */
export function getFormFieldsInfo(target: Record<string, any>): FormFieldInfo[] {
    return Reflect.getOwnMetadata(FORM_FIELD_INFO_METADATA, target) || [];
}

/**
 * Defines the for fields info for a class.
 *
 * @param target The target class
 * @param info The information to set
 */
export function setFormFieldsInfoFor(target: Record<string, any>, info: FormFieldInfo[]): void {
    return Reflect.defineMetadata(FORM_FIELD_INFO_METADATA, info, target);
}

/**
 * Adds a form field information to the class' form fields information.
 * 
 * @param target The target class
 * @param info The info to add
 */
export function addFormFieldInfo(target: Record<string, any>, info: FormFieldInfo): void {
    const allInfo = getFormFieldsInfo(target);
    allInfo.push(info);
    setFormFieldsInfoFor(target, allInfo);
}
