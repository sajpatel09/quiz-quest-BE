import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {
    CreateCategoryDto,
    DeleteCategoryDto,
    GetCategoriesDto,
    GetCategoryDto,
    UpdateCategoryDto
} from './dto/category.dto';
import {CategoryService} from './category.service';
import {AdminAuthGuard} from "../../guard/admin-auth.guard";

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {
    }

    @UseGuards(AdminAuthGuard)
    @Post()
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Get(':id')
    async getCategory(@Param() params: GetCategoryDto) {
        return this.categoryService.getCategory(params);
    }

    @Get()
    async getAllCategories(@Query() query: GetCategoriesDto) {
        return this.categoryService.getAllCategories(query);
    }

    @UseGuards(AdminAuthGuard)
    @Delete(':id')
    async deleteCategory(@Param() params: DeleteCategoryDto) {
        return this.categoryService.deleteCategory(params);
    }

    @UseGuards(AdminAuthGuard)
    @Patch()
    async updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.updateCategory(updateCategoryDto);
    }
}
