import validator from 'validator';
import { EmailValidatorAdapter } from '@/utils/EmailValidatorAdapter';

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator returns false', async () => {
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => false);
    const sut = new EmailValidatorAdapter();
    const isValid = sut.validate('invalid_email@email.com');

    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', async () => {
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => true);
    const sut = new EmailValidatorAdapter();
    const isValid = sut.validate('valid_email@email.com');

    expect(isValid).toBe(true);
  });
});
