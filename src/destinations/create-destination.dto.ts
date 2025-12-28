import { IsString, IsNumber, IsOptional, IsBoolean, IsDecimal } from 'class-validator';

export class CreateDestinationDto {
  @IsNumber()
  hubId: number;

  @IsString()
  name: string;

  @IsString()
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
  @IsOptional()
  fromCity?: string;

  @IsString()
  @IsOptional()
  toCity?: string;

  @IsString()
  @IsOptional()
  distance?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  priceNote?: string;

  @IsString()
  @IsOptional()
  features?: string;

  @IsString()
  @IsOptional()
  gallery?: string;

  @IsString()
  @IsOptional()
  faq?: string;

  @IsString()
  @IsOptional()
  tariffs?: string;

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

  @IsString()
  @IsOptional()
  heroImagePrompt?: string;

  @IsNumber()
  @IsOptional()
  toLat?: number;

  @IsNumber()
  @IsOptional()
  toLng?: number;

  @IsOptional()
  weatherData?: any;

  @IsOptional()
  weatherUpdatedAt?: Date;

  @IsNumber()
  @IsOptional()
  tripCountBase?: number;

  @IsOptional()
  tripCountDate?: Date;
}