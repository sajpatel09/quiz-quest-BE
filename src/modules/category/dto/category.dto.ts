import {IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, Validate} from 'class-validator';
import {Transform} from "class-transformer";
import {MaxBase64Size} from "../../../validators/max-base64-size.validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @Matches(/^data:image\/(png|jpeg|jpg|webp);base64,/, {
        message: 'Invalid image format. Only PNG or JPEG base64 images are allowed.',
    })
    @Validate(MaxBase64Size, [100])
    image: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {
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
