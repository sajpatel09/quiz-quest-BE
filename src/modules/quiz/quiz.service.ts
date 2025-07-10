import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Quiz, QuizDocument} from './schemas/quiz.schema';
import {CreateQuizDto, DeleteQuizDto, GetAllQuizDto, GetQuizDto, UpdateQuizDto} from './dto/quiz.dto';

@Injectable()
export class QuizService {
    constructor(
        @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    ) {
    }

    async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
        const createdQuiz = new this.quizModel(createQuizDto);
        return createdQuiz.save();
    }

    async findAll(data: GetAllQuizDto): Promise<Quiz[]> {

        const query = {};

        if (data.search) {
            Object.assign(query,
                {title: {$regex: data.search, $options: 'i'}}
            )
        }

        if (data.category) {
            Object.assign(query,
                {
                    category: data.category
                }
            )
        }

        return this.quizModel.find(query).populate('category').exec();
    }

    async findOne({id}: GetQuizDto): Promise<Quiz> {
        const quiz = await this.quizModel.findById(id).populate('category').exec();
        if (!quiz) throw new NotFoundException('Quiz not found');
        return quiz;
    }

    async update(updateQuizDto: UpdateQuizDto): Promise<Quiz> {
        const quiz = await this.quizModel.findByIdAndUpdate(updateQuizDto.id, updateQuizDto, {new: true}).exec();
        if (!quiz) throw new NotFoundException('Quiz not found');
        return quiz;
    }

    async remove({id}: DeleteQuizDto): Promise<Quiz> {
        const quiz = await this.quizModel.findByIdAndDelete(id).exec();
        if (!quiz) throw new NotFoundException('Quiz not found');
        return quiz;
    }
}
