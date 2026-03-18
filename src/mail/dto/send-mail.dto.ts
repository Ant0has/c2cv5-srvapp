import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class SendMailDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9+() -]{5,20}$/, { message: 'Некорректный номер телефона' })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  block?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  device_info?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  trip_date?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  additional_info?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  auto_class?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  order_from?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  order_to?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  trip_price_from?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  trip_type?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  сurrent_route?: string;
}
