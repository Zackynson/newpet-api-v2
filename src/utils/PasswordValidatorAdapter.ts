import validator from 'validator';
import { PasswordValidator } from '@/presentation/protocols';

export class PasswordValidatorAdapter implements PasswordValidator {
  validate(password: string): boolean {
    return validator.isStrongPassword(password, {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
    });
  }
}
