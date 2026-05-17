import { IsIn, IsObject, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsIn(['owned', 'wanted'])
  status?: 'owned' | 'wanted';

  @IsOptional()
  @IsObject()
  values?: Record<string, any>;
}
