import validator from 'validator';
import { PasswordValidatorAdapter } from '@/utils/PasswordValidatorAdapter';

const makeSut = (): PasswordValidatorAdapter => new PasswordValidatorAdapter();

describe('PasswordValidatorAdapter', () => {
  test('Should return false if validator returns false', async () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isStrongPassword').mockImplementationOnce(() => false);
    const isValid = sut.validate('invalid_password');

    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', async () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isStrongPassword').mockImplementationOnce(() => true);
    const isValid = sut.validate('valid_password');

    expect(isValid).toBe(true);
  });

  test('Should call validator with correct values', async () => {
    const sut = makeSut();
    const isStrongPasswordSpy = jest.spyOn(validator, 'isStrongPassword');
    const password = 'valid_password';

    sut.validate(password);

    expect(isStrongPasswordSpy).toBeCalledWith(password, {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
    });
  });
});
