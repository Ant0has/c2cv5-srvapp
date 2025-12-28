import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsNotEmpty } from 'class-validator';

export class CreateDestinationDto {
  @IsNumber()
  @IsNotEmpty()
  hub_id: number;

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
  subtitle?: string;

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

  @IsString()
  @IsNotEmpty()
  fromCity: string;

  @IsString()
  @IsNotEmpty()
  toCity: string;

  @IsNumber()
  @IsNotEmpty()
  distance: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  priceNote?: string;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsArray()
  @IsOptional()
  gallery?: string[];

  @IsArray()
  @IsOptional()
  faq?: Array<{ question: string; answer: string }>;

  @IsArray()
  @IsOptional()
  tariffs?: Array<{ name: string; price: number; description: string }>;

  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}