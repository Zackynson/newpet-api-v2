import { Validator } from '@/presentation/protocols';
import { InvalidParamError } from '@/presentation/errors';

export class CompareFieldsValidator implements Validator {
  constructor(
    private readonly fieldName:string,
    private readonly fieldNameToCompare: string,
  ) {}

  async validate(input: any): Promise<Error> {
    if (input?.[this.fieldName] !== input?.[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare);
    }

    return null;
  }
}
