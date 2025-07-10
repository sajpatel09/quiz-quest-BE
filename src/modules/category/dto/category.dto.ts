import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class GetCategoryDto {
  @IsMongoId()
  id: string;
}

export class DeleteCategoryDto {
  @IsMongoId()
  id: string;
}

export class GetCategoriesDto {
  @IsOptional()
  @IsString()
  search: string;
}
