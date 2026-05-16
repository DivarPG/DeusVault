import { IsIn, IsObject } from 'class-validator';

export class CreateItemDto {
  @IsIn(['owned', 'wanted'])
  status: 'owned' | 'wanted';

  @IsObject()
  values: Record<string, any>;
}
