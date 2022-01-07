import validator from 'validator';
import { EmailValidatorAdapter } from '@/utils/EmailValidatorAdapter';

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter();

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator returns false', async () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => false);
    const isValid = sut.validate('invalid_email@email.com');

    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', async () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => true);
    const isValid = sut.validate('valid_email@email.com');

    expect(isValid).toBe(true);
  });

  test('Should call validator with correct values', async () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => true);
    const email = 'any_email@email.com';

    sut.validate(email);

    expect(isEmailSpy).toBeCalledWith(email);
  });
});
