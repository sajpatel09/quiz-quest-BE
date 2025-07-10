import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {QuestionService} from './question.service';
import {CreateQuestionDto, DeleteQuestionDto, GetQuestionDto, UpdateQuestionDto,} from './dto/question.dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {
    }

    @Post()
    async create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.create(createQuestionDto);
    }

    @Get()
    async findAll() {
        return this.questionService.findAll();
    }

    @Get(':id')
    async findOne(@Param() data: GetQuestionDto) {
        return this.questionService.findOne(data);
    }

    @Patch()
    async update(@Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionService.update(updateQuestionDto);
    }

    @Delete(':id')
    async remove(@Param() data: DeleteQuestionDto) {
        return this.questionService.remove(data);
    }
}