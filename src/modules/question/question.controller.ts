import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {QuestionService} from './question.service';
import {
    CreateQuestionDto,
    DeleteQuestionDto,
    GetAllQuestionDto,
    GetQuestionDto,
    UpdateQuestionDto,
} from './dto/question.dto';
import {AdminAuthGuard} from "../../guard/admin-auth.guard";

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {
    }

    @UseGuards(AdminAuthGuard)
    @Post()
    async create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.create(createQuestionDto);
    }

    @Get()
    async findAll(@Query() data:GetAllQuestionDto) {
        return this.questionService.findAll(data);
    }

    @Get(':id')
    async findOne(@Param() data: GetQuestionDto) {
        return this.questionService.findOne(data);
    }

    @UseGuards(AdminAuthGuard)
    @Patch()
    async update(@Body() updateQuestionDto: UpdateQuestionDto) {
        return this.questionService.update(updateQuestionDto);
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    async remove(@Param() data: DeleteQuestionDto) {
        return this.questionService.remove(data);
    }
}