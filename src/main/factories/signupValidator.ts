/* eslint-disable max-len */
import { PasswordStrengthValidator, CompareFieldsValidator, RequiredFieldsValidator } from '@/utils';
import { ValidatorComposite } from '@/utils/ValidatorComposite';

const requiredFields = ['name', 'email', 'password', 'confirmPassword'];

export const makeSignUpValidator = (): ValidatorComposite => {
  const requiredFieldsValidator = new RequiredFieldsValidator(requiredFields);
  const passwordValidator = new PasswordStrengthValidator('password', {
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  });

  const compareFieldsValidator = new CompareFieldsValidator('password', 'confirmPassword');

  return new ValidatorComposite([requiredFieldsValidator, passwordValidator, compareFieldsValidator]);
};
