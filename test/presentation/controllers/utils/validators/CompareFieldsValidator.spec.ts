import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidator } from '@/utils';

describe('CompareFieldsValidator', () => {
  test('Should return a missing param error if a required field is not provided', async () => {
    const sut = new CompareFieldsValidator('field1', 'field2');

    const response = await sut.validate({ field1: 'a', field2: 'b' });

    expect(response).toEqual(new InvalidParamError('field2'));
  });
});
