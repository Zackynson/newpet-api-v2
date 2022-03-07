/* eslint-disable max-len */
import { PasswordStrengthValidator } from '@/utils';
import { RequiredFieldsValidator } from '@/utils/RequiredFieldsValidator';
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

  return new ValidatorComposite([requiredFieldsValidator, passwordValidator]);
};
