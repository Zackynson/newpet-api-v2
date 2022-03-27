/* eslint-disable max-len */
import { RequiredFieldsValidator } from '@/utils';
import { ValidatorComposite } from '@/utils/ValidatorComposite';

const requiredFields = ['name', 'age', 'category'];

export const makeRegisterPetValidator = (): ValidatorComposite => {
  const requiredFieldsValidator = new RequiredFieldsValidator(requiredFields);

  return new ValidatorComposite([requiredFieldsValidator]);
};
