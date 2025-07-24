import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
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
    const { search, limit, page, quiz, random } = data;

    const response = {
        questions: [],
        total: 0
    }

    const aggregationFilter: any = {};
    if (search) {
      aggregationFilter.question = { $regex: search, $options: 'i' };
    }
    if (quiz) {
      aggregationFilter.quiz = quiz;
    }

    const pipeline: any[] = [{ $match: aggregationFilter }];

    if(random) {
      const sampleSize = limit ? +limit :  await this.questionModel.countDocuments(aggregationFilter);
      if (sampleSize > 0) {
        pipeline.push({ $sample: { size: sampleSize } });
      }
      response.total = sampleSize > 0 ? sampleSize : 0
    } else {
      if (page && limit) {
        const skip = (page - 1) * limit;
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: Number(limit) });
      } else if (limit) {
        pipeline.push({ $limit: Number(limit) });
      }
    }

    pipeline.push(
        {
          $lookup: {
            from: 'quizzes',
            localField: 'quiz',
            foreignField: '_id',
            as: 'quiz',
          },
        },
        {
          $unwind: {
            path: '$quiz',
            preserveNullAndEmptyArrays: true,
          },
        }
    );

    const [questions, total] = await Promise.all([
      this.questionModel.aggregate(pipeline),
      this.questionModel.countDocuments(aggregationFilter),
    ]);

    return { questions, total: response.total || total };
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
