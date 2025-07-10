import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Category} from './schemas/category.schema';
import {
    CreateCategoryDto,
    DeleteCategoryDto,
    GetCategoriesDto,
    GetCategoryDto,
    UpdateCategoryDto
} from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const createdCategory = new this.categoryModel(createCategoryDto);
            return createdCategory.save();
        } catch (error) {
            throw new HttpException(
                {
                    status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
                    error: error?.response?.error,
                    message: error?.message,
                },
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getCategory({id}: GetCategoryDto): Promise<Category | null> {
        try {
            return await this.categoryModel.findById(id).exec();
        } catch (error) {
            throw new HttpException(
                {
                    status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
                    error: error?.response?.error,
                    message: error?.message,
                },
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAllCategories(query: GetCategoriesDto): Promise<Category[]> {
        try {
            return await this.categoryModel.find(
                query?.search
                    ? {
                        $or: [
                            {name: {$regex: query.search, $options: 'i'}},
                        ],
                    } : {},
            ).exec();
        } catch (error) {
            throw new HttpException(
                {
                    status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
                    error: error?.response?.error,
                    message: error?.message,
                },
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteCategory({id}: DeleteCategoryDto): Promise<Category | null> {
        try {
            return await this.categoryModel.findByIdAndDelete(id).exec();
        } catch (error) {
            throw new HttpException(
                {
                    status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
                    error: error?.response?.error,
                    message: error?.message,
                },
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateCategory(updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
        try {
            return await this.categoryModel.findByIdAndUpdate(updateCategoryDto.id, updateCategoryDto, {new: true}).exec();
        } catch (error) {
            throw new HttpException(
                {
                    status: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
                    error: error?.response?.error,
                    message: error?.message,
                },
                error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
