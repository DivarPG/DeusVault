import { z } from 'zod';

export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'multiline';

export interface TemplateField {
  name: string;
  type: FieldType;
  label: string;
}

export interface CollectionTemplate {
  fields: TemplateField[];
}

const fieldTypeToZod: Record<FieldType, z.ZodTypeAny> = {
  text: z.string(),
  number: z.number(),
  boolean: z.boolean(),
  date: z.string().refine((val) => val === '' || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  multiline: z.string(),
};

export function createItemValuesSchema(template: CollectionTemplate) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of template.fields) {
    shape[field.name] = fieldTypeToZod[field.type] || z.any();
  }

  return z.object(shape);
}
