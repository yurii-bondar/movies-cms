import { Request, Response, NextFunction } from 'express';
import Ajv, { AnySchemaObject } from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';
import { HTTP_STATUS_CODES } from '../constants';

const ajv = new Ajv({ allErrors: true, coerceTypes: true });
addFormats(ajv);
addErrors(ajv);

interface SchemaMap {
  body?: AnySchemaObject;
  params?: AnySchemaObject;
  query?: AnySchemaObject;
}

export function validateSchema(schemas: SchemaMap) {
  const validators = Object
    .entries(schemas)
    .map(([key, schema]) => ({
      key: key as keyof SchemaMap,
      validate: ajv.compile(schema),
    }));

  return (req: Request, res: Response, next: NextFunction) => {
    validators.forEach(({ key, validate }) => {
      const data = req[key];

      if (!validate(data)) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({
            message: `Validation failed in ${key}`,
            errors: validate.errors,
          });
      }
    });

    return next();
  };
}
