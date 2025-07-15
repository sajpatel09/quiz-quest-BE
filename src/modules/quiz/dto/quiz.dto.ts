import {IsInt, IsMongoId, IsOptional, IsString, Length} from 'class-validator';
import {Transform} from "class-transformer";

export class CreateQuizDto {
    @IsString()
    @Length(2, 100)
    title: string;

    @IsMongoId()
    category: string;

    @IsInt()
    entryFee: number;

    @IsInt()
    prize: number;
}

export class UpdateQuizDto extends CreateQuizDto {
    @IsMongoId()
    id: string;
}

export class GetQuizDto {
    @IsMongoId()
    id: string;
}

export class DeleteQuizDto {
    @IsMongoId()
    id: string;
}

export class GetAllQuizDto {
    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @IsMongoId()
    category: string;

    @IsOptional()
    @Transform(({value}) => isNaN(value) ? undefined : parseInt(value))
    @IsInt()
    limit: number;

    @IsOptional()
    @Transform(({value}) => isNaN(value) ? undefined : parseInt(value))
    @IsInt()
    page: number;
}
