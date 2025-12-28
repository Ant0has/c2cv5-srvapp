import { IsString, IsNumber, IsOptional, IsBoolean, IsObject, IsNotEmpty } from 'class-validator';

export class CreateHubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsString()
  @IsOptional()
  seoKeywords?: string;

  @IsString()
  @IsOptional()
  heroImage?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsObject()
  @IsOptional()
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };

  @IsObject()
  @IsOptional()
  socialLinks?: {
    telegram?: string;
    whatsapp?: string;
    vk?: string;
    instagram?: string;
  };

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}