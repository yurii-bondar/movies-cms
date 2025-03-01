import { JSONSchemaType } from 'ajv';

const signup: JSONSchemaType<{
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2, maxLength: 50 },
    password: { type: 'string', minLength: 6, maxLength: 100 },
    confirmPassword: { type: 'string', minLength: 6, maxLength: 100 },
  },
  required: ['email', 'name', 'password', 'confirmPassword'],
  additionalProperties: false,
};

const signin: JSONSchemaType<{
  email: string;
  password: string;
}> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6, maxLength: 100 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

const refreshToken: JSONSchemaType<{
  refreshToken: string;
}> = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string', minLength: 10 },
  },
  required: ['refreshToken'],
  additionalProperties: false,
};

export default {
  signup,
  signin,
  refreshToken,
};
