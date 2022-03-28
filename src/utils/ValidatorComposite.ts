/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Validator } from '@/presentation/protocols';

export class ValidatorComposite implements Validator {
  constructor(private readonly validators: Validator[]) {}

  async validate(input: any): Promise<Error> {
    for (const validator of this.validators) {
      const error = await validator.validate(input);
      if (error) {
        return error;
      }
    }

    return null;
  }
}
