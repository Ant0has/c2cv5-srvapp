import { IsString, MaxLength, Matches, IsOptional, IsNumberString } from 'class-validator';

export class RouteUrlParam {
  @IsString()
  @MaxLength(200)
  @Matches(/^[a-z0-9\-]+$/, { message: 'Invalid URL format' })
  url: string;
}

export class ReviewsQueryDto {
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsNumberString()
  offset?: number;
}
