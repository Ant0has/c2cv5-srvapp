import { IsOptional, IsString } from 'class-validator';

export class UpdateRegionDataDTO {
  @IsOptional()
  @IsString()
  meta_value?: string;

  @IsOptional()
  @IsString()
  region_value?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;
}
