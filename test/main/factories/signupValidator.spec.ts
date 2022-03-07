/* eslint-disable max-len */
import { ValidatorComposite } from '@/utils/ValidatorComposite';
import { makeSignUpValidator } from '@/main/factories/signupValidator';
import { RequiredFieldsValidator } from '@/utils/RequiredFieldsValidator';

jest.mock('@/utils/ValidatorComposite');

const requiredFields = ['name', 'email', 'password', 'confirmPassword'];

describe('SignupValidator Factory', () => {
  test('Should call validatorComposite with all validators', () => {
    makeSignUpValidator();
    expect(ValidatorComposite).toBeCalledWith([
      new RequiredFieldsValidator(requiredFields),
    ]);
  });
});
