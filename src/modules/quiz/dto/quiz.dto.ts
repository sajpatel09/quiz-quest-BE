import {IsMongoId, IsOptional, IsString, Length} from 'class-validator';

export class CreateQuizDto {
    @IsString()
    @Length(3, 100)
    title: string;

    @IsMongoId()
    category: string;
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
}
