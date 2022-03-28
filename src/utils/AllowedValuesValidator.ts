/* eslint-disable no-restricted-syntax */
import { InvalidParamError } from '@/presentation/errors';
import { Validator } from '@/presentation/protocols';

export class AllowedValuesValidator implements Validator {
  constructor(private readonly fieldName: string, private readonly allowedValues: string[]) {}

  async validate(input: any): Promise<Error> {
    if (!this.allowedValues.includes(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
