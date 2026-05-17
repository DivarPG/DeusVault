import { IsArray, ValidateNested, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateFieldDto } from './template-field.dto';

export class CollectionTemplateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(30, { message: 'Template can have at most 30 fields' })
  @Type(() => TemplateFieldDto)
  fields: TemplateFieldDto[];
}
