import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto, UpdateQuestionDto, GetQuestionDto, DeleteQuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionService {
  constructor(
      @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().populate('quiz').exec();
  }

  async findOne({ id }: GetQuestionDto): Promise<Question> {
    const question = await this.questionModel.findById(id).populate('quiz').exec();
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
}
