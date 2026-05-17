import { IsString, IsIn } from 'class-validator';
import type { FieldType } from '../validation/template.validator';

export class TemplateFieldDto {
  @IsString()
  name: string;

  @IsIn(['text', 'number', 'boolean', 'date', 'multiline'])
  type: FieldType;

  @IsString()
  label: string;
}
