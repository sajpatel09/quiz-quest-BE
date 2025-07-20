import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import {
  CreateQuestionDto,
  DeleteQuestionDto,
  GetAllQuestionDto,
  GetQuestionDto,
  UpdateQuestionDto,
} from './dto/question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async findAll(
    data: GetAllQuestionDto,
  ): Promise<{ questions: Question[]; total: number }> {
    const { search, limit, page, quiz } = data;

    const filter: any = {};
    if (search) {
      filter.$or = [{ question: { $regex: search, $options: 'i' } }];
    }
    if (quiz) {
      filter.quiz = quiz;
    }

    let dataQuery = this.questionModel.find(filter).populate('quiz');

    if (limit && page) {
      const skip = (page - 1) * limit;
      dataQuery = dataQuery.skip(skip).limit(limit);
    }

    const [questions, total] = await Promise.all([
      dataQuery.exec(),
      this.questionModel.countDocuments(filter),
    ]);

    return { questions, total };
  }

  async findOne({ id }: GetQuestionDto): Promise<Question> {
    const question = await this.questionModel
      .findById(id)
      .populate('quiz')
      .exec();
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.questionModel
      .findByIdAndUpdate(updateQuestionDto.id, updateQuestionDto, { new: true })
      .exec();
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async remove({ id }: DeleteQuestionDto): Promise<Question> {
    const question = await this.questionModel.findByIdAndDelete(id).exec();
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async getRandomQuestions(count: number) {
    return this.questionModel.aggregate([{ $sample: { size: count } }]);
  }
}
