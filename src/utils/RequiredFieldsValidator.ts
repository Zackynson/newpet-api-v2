/* eslint-disable no-restricted-syntax */
import { MissingParamError } from '@/presentation/errors';
import { Validator } from '@/presentation/protocols';

export class RequiredFieldsValidator implements Validator {
  constructor(private readonly requiredFields: string[]) {}

  async validate(input: any): Promise<Error> {
    const missingField = this.requiredFields.find((field) => !input[field]);

    if (missingField) return new MissingParamError(missingField);

    return null;
  }
}
