import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {CreateCategoryDto, DeleteCategoryDto, GetCategoryDto, UpdateCategoryDto} from './dto/category.dto';
import {CategoryService} from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {
    }

    @Post()
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Get(':id')
    async getCategory(@Param() params: GetCategoryDto) {
        return this.categoryService.getCategory(params);
    }

    @Get()
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @Delete(':id')
    async deleteCategory(@Param() params: DeleteCategoryDto) {
        return this.categoryService.deleteCategory(params);
    }

    @Patch()
    async updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.updateCategory(updateCategoryDto);
    }
}
