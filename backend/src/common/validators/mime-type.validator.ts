import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ALLOWED_MIME_TYPES } from '../constants';

export function IsAllowedMimeType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAllowedMimeType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && ALLOWED_MIME_TYPES.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          const allowedTypeNames = ALLOWED_MIME_TYPES.map(type => {
            const { MIME_TYPE_NAMES } = require('../constants');
            return MIME_TYPE_NAMES[type] || type;
          }).join(', ');
          
          return `MIME type "${args.value}" is not allowed. Allowed types: ${allowedTypeNames}`;
        },
      },
    });
  };
} 
