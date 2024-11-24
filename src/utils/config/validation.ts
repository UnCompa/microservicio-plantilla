import * as Joi from 'joi';

export const validationSchemaEnvs = Joi.object({
  PORT: Joi.number().integer().positive().required(),
  USE_KAFKA: Joi.boolean().truthy('true').falsy('false').optional(),
  KAFKA_BROKERS: Joi.string()
    .pattern(/^(.*?:\d+(,.*?:\d+)*)$/)
    .optional(),
  KAFKA_TOPIC: Joi.string().optional(),
});
