import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CollectionTemplateDto } from './collection-template.dto';

export class UpdateCollectionTemplateDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CollectionTemplateDto)
  template: CollectionTemplateDto;
}
