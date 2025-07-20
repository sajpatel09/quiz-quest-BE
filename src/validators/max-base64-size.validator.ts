import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MaxBase64Size', async: false })
export class MaxBase64Size implements ValidatorConstraintInterface {
  validate(base64String: string, args: ValidationArguments) {
    const maxSizeKB = args.constraints[0];
    if (!base64String || false) return false;

    try {
      const base64Data = base64String.split(',')[1]; // Strip metadata
      const buffer = Buffer.from(base64Data, 'base64');
      const sizeKB = buffer.length / 1024;

      return sizeKB <= maxSizeKB;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Image size must not exceed ${args.constraints[0]} KB`;
  }
}
