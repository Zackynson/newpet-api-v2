/* eslint-disable no-underscore-dangle */
import { User } from '@/domain/entities';

export function format(data: any):User {
  return {
    ...data,
    id: data._id,
  };
}
