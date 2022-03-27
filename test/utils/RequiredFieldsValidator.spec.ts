import { MissingParamError } from '@/presentation/errors';
import { RequiredFieldsValidator } from '@/utils/RequiredFieldsValidator';

describe('RequiredFieldsValidator', () => {
  test('Should return a missing param error if a required field is not provided', async () => {
    const sut = new RequiredFieldsValidator(['some_param', 'another_param']);

    const response = await sut.validate({ some_param: 'provided' });

    expect(response).toEqual(new MissingParamError('another_param'));
  });

  test('Should return a null if all required fields are provided', async () => {
    const sut = new RequiredFieldsValidator(['some_param', 'another_param']);

    const response = await sut.validate({
      some_param: 'any_value',
      another_param: 'another_value',
    });

    expect(response).toBeNull();
  });

  test('Should ignore not required fields', async () => {
    const sut = new RequiredFieldsValidator(['some_param', 'another_param']);

    const response = await sut.validate({
      some_param: 'any_value',
      another_param: 'another_value',
      not_required: null,
      not_required_as_well: 0,
    });

    expect(response).toBeNull();
  });
});
