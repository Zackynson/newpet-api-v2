import { InvalidParamError } from '@/presentation/errors';
import { PasswordStrengthValidator } from '@/utils';

describe('PasswordStrengthValidator', () => {
  test('Should return an InvalidParamError if password is invalid', async () => {
    const sut = new PasswordStrengthValidator('password', {
      minLength: 8,
    });

    const respose = await sut.validate({ password: 'any' });

    expect(respose).toEqual(new InvalidParamError('password'));
  });

  test('Should return an InvalidParamError if no input is provided', async () => {
    const sut = new PasswordStrengthValidator('password', {
      minLength: 8,
    });

    const respose = await sut.validate(null);

    expect(respose).toEqual(new InvalidParamError('password'));
  });

  test('Should return an InvalidParamError if no options are provided', async () => {
    const sut = new PasswordStrengthValidator('password');

    const respose = await sut.validate(null);

    expect(respose).toEqual(new InvalidParamError('password'));
  });

  test('Should return null if password is valid', async () => {
    const sut = new PasswordStrengthValidator('password', {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,

    });

    const respose = await sut.validate({ password: 'Abc123$%435' });

    expect(respose).toEqual(null);
  });
});
