import {
    IsArray,
    IsBoolean,
    IsInt,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Min,
    ValidateNested,
} from 'class-validator';
import {Transform, Type} from 'class-transformer';

class OptionDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsOptional()
    isCorrect?: boolean;
}

export class CreateQuestionDto {
    @IsMongoId()
    quiz: string;

    @IsString()
    @Length(5, 500)
    question: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => OptionDto)
    options: OptionDto[];
}

export class UpdateQuestionDto extends CreateQuestionDto {
    @IsMongoId()
    id: string;
}

export class GetQuestionDto {
    @IsMongoId()
    id: string;
}

export class DeleteQuestionDto {
    @IsMongoId()
    id: string;
}

export class GetAllQuestionDto {
    @IsOptional()
    @IsMongoId()
    quiz: string;

    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page: number;

    @IsOptional()
    @Transform(({value}) => value === 'true')
    @IsBoolean()
    random?: boolean;
}

export class GetRandomQuestionDto {
    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @Min(1)
    count: number;
}
