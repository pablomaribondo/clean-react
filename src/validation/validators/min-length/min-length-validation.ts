import { InvalidFieldError } from '@/validation/errors'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class MinLengthValidation implements FieldValidation {
  readonly field: string;
  private readonly minLength: number;

  constructor (field: string, minLength: number) {
    this.field = field
    this.minLength = minLength
  }

  validate (value: string): Error {
    return value.length >= this.minLength ? null : new InvalidFieldError()
  }
}
