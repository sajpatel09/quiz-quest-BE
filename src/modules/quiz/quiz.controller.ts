import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {QuizService} from './quiz.service';
import {CreateQuizDto, DeleteQuizDto, GetAllQuizDto, GetQuizDto, UpdateQuizDto} from './dto/quiz.dto';
import {AdminAuthGuard} from "../../guard/admin-auth.guard";

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) {
    }

    @UseGuards(AdminAuthGuard)
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

    @UseGuards(AdminAuthGuard)
    @Patch()
    async update(@Body() updateQuizDto: UpdateQuizDto) {
        return this.quizService.update(updateQuizDto);
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    async remove(@Param() data: DeleteQuizDto) {
        return this.quizService.remove(data);
    }
}
