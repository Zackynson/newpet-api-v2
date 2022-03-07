import validator from 'validator';
import { Validator } from '@/presentation/protocols';
import { InvalidParamError } from '@/presentation/errors';

export class PasswordStrengthValidator implements Validator {
  constructor(
    private readonly fieldName:string,
    private readonly options: validator.strongPasswordOptions = {},
  ) {}

  async validate(input: any): Promise<Error> {
    const isStrongPassword = validator.isStrongPassword(input?.[this.fieldName], this.options);

    if (!isStrongPassword) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
