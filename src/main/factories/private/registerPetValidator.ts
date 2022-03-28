/* eslint-disable max-len */
import { RequiredFieldsValidator } from '@/utils';
import { AllowedValuesValidator } from '@/utils/AllowedValuesValidator';
import { ValidatorComposite } from '@/utils/ValidatorComposite';

const requiredFields = ['name', 'age', 'category'];
const allowedCategories = ['cat', 'bird', 'dog', 'other'];

export const makeRegisterPetValidator = (): ValidatorComposite => {
  const requiredFieldsValidator = new RequiredFieldsValidator(requiredFields);
  const allowedValuesValidator = new AllowedValuesValidator('category', allowedCategories);
  return new ValidatorComposite([requiredFieldsValidator, allowedValuesValidator]);
};
