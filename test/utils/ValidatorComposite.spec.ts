/* eslint-disable max-len */
import { ValidatorComposite } from '@/utils/ValidatorComposite';

describe('SignupValidator Factory', () => {
  test('Should return null if no Validator is no error is returned', async () => {
    const sut = new ValidatorComposite([]);

    const response = await sut.validate({});
    expect(response).toEqual(null);
  });
});
