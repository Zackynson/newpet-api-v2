/* eslint-disable no-underscore-dangle */
import { Pet } from '@/domain/entities';

export function format(data: any):Pet {
  return {
    ...data,
    id: data?._id?.toString(),
  };
}
