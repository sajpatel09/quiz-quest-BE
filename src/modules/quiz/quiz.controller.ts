import {Controller, Post, Get, Patch, Delete, Param, Body, Query} from '@nestjs/common';
import { QuizService } from './quiz.service';
import {CreateQuizDto, UpdateQuizDto, GetQuizDto, DeleteQuizDto, GetAllQuizDto} from './dto/quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  async findAll(@Query() query: GetAllQuizDto) {
    return this.quizService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() data: GetQuizDto) {
    return this.quizService.findOne(data);
  }

  @Patch()
  async update(@Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(updateQuizDto);
  }

  @Delete(':id')
  async remove(@Param() data: DeleteQuizDto) {
    return this.quizService.remove(data);
  }
}
