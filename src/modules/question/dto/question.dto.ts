import {IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, Length, ValidateNested,} from 'class-validator';
import {Type} from 'class-transformer';

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
