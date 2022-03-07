/* eslint-disable max-len */
import { ValidatorComposite } from '@/utils/ValidatorComposite';
import { makeSignUpValidator } from '@/main/factories/signupValidator';
import { RequiredFieldsValidator, PasswordStrengthValidator } from '@/utils';

jest.mock('@/utils/ValidatorComposite');

const requiredFields = ['name', 'email', 'password', 'confirmPassword'];

describe('SignupValidator Factory', () => {
  test('Should call validatorComposite with all validators', () => {
    makeSignUpValidator();
    expect(ValidatorComposite).toBeCalledWith([
      new RequiredFieldsValidator(requiredFields),
      new PasswordStrengthValidator('password', {
        minLength: 8,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
      }),
    ]);
  });
});
