import { IsIn, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  block?: string;

  @IsString()
  @IsOptional()
  device_info?: string;

  @IsString()
  @IsOptional()
  trip_date?: string;

  @IsString()
  @IsOptional()
  additional_info?: string;

  @IsString()
  @IsOptional()
  auto_class?: string;

  @IsString()
  @IsOptional()
  order_from?: string;

  @IsString()
  @IsOptional()
  order_to?: string;

  @IsString()
  @IsOptional()
  trip_price_from?: string;

  @IsString()
  @IsOptional()
  @IsIn(['now', 'preorder'], {
    message: 'Тип поездки должен быть либо "now", либо "preorder"',
  })
  trip_type?: 'now' | 'preorder';
}
