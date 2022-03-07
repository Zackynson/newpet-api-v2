export interface Validator {
    validate(input:any): Promise<Error>
}
