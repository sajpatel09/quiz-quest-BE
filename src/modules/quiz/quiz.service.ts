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

    async findAll(data: GetAllQuizDto): Promise<{ quizzes: Quiz[], total: number }> {

        const {search, limit, page, category} = data;

        const filter: any = {};
        if (search) {
            filter.$or = [{title: {$regex: search, $options: 'i'}}];
        }
        if (category) {
            filter.category = category;
        }

        let dataQuery = this.quizModel.find(filter).populate('category');

        if (limit && page) {
            const skip = (page - 1) * limit;
            dataQuery = dataQuery.skip(skip).limit(limit);
        }

        const [quizzes, total] = await Promise.all([
            dataQuery.exec(),
            this.quizModel.countDocuments(filter),
        ]);

        return {quizzes, total};
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
