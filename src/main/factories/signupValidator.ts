/* eslint-disable max-len */
import { RequiredFieldsValidator } from '@/utils/RequiredFieldsValidator';
import { ValidatorComposite } from '@/utils/ValidatorComposite';

const requiredFields = ['name', 'email', 'password', 'confirmPassword'];

export const makeSignUpValidator = (): ValidatorComposite => {
  const requiredFieldsValidator = new RequiredFieldsValidator(requiredFields);
  return new ValidatorComposite([requiredFieldsValidator]);
};
