import {IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Transform} from "class-transformer";

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

    @IsOptional()
    @Transform(({value}) => isNaN(value) ? undefined : parseInt(value))
    @IsInt()
    limit: number;

    @IsOptional()
    @Transform(({value}) => isNaN(value) ? undefined : parseInt(value))
    @IsInt()
    page: number;
}
