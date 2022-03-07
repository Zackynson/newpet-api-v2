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
});
