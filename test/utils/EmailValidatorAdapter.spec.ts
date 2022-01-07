import { EmailValidatorAdapter } from '@/utils/EmailValidatorAdapter';

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter();
    const isValid = await sut.validate('invalid_email@email.com');

    expect(isValid).toBe(false);
  });
});
