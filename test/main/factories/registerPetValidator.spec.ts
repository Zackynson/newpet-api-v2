/* eslint-disable max-len */
import { ValidatorComposite } from '@/utils/ValidatorComposite';
import { RequiredFieldsValidator } from '@/utils';
import { makeRegisterPetValidator } from '@/main/factories/private/registerPetValidator';

jest.mock('@/utils/ValidatorComposite');

const requiredFields = ['name', 'age', 'category'];

describe('SignupValidator Factory', () => {
  test('Should call validatorComposite with all validators', () => {
    makeRegisterPetValidator();
    expect(ValidatorComposite).toBeCalledWith([
      new RequiredFieldsValidator(requiredFields),
    ]);
  });
});
