import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  template: Record<string, any>;
}
