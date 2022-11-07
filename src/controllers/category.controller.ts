
import { Request, Response } from 'express';
import categoriesService from '../services/categories.service';
import { plainToClass } from 'class-transformer';
import { CreateCategoryDto } from '../dtos/create_category.dto';
import { Category } from '../models/category.model';
import wordsService from '../services/words.service';

import categories from '../files_json/categories.json';
import words from '../files_json/words.json';

class CategoryController {

    public getCategories = async (req: Request, res: Response): Promise<Response> => {
    
        try {

            const categories = await categoriesService.getCategories();
            
            return res.status(200).send(categories);
            
        } catch (error) {
            
            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));
            
        }

    };
    
    public getCategoryById = async (req: Request, res: Response): Promise<Response> => {
    
        try {

            const { id } = req.params;

            const category: Category = await categoriesService.getCategoryById(+id);

            return res.status(200).send(category);
            
        } catch (error) {

            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));

        }

    };

    public getCategoryWords = async (req: Request, res: Response): Promise<Response> => {
    
        try {

            const { id } = req.params;

            const words = await wordsService.getWordsCategory(+id);
            
            return res.status(200).send(words);
            
        } catch (error) {
            
            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));
            
        }

    };

    public createCategory = async (req: Request, res: Response): Promise<Response> => {
    
        try {

            const payload = req.body;

            const createCategoryDto: CreateCategoryDto = plainToClass(CreateCategoryDto, payload);      
            const validatedCategory: CreateCategoryDto = await categoriesService.validationCategory(createCategoryDto);

            const newCategory = ({
                id: Math.max( ...categories.map(d => d.id)) + 1,
                name: validatedCategory.name!,
                description: validatedCategory.description!
            });

            categories.push(newCategory);

            return res.status(201).send(newCategory);
            
        } catch (error) {

            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));

        }

    };

    public updateCategory = async (req: Request, res: Response): Promise<Response> => {
    
        try {

            const { id } = req.params;
            const payload: any = req.body;

            const category: Category = await categoriesService.getCategoryById(+id);

            const createCategoryDto: CreateCategoryDto = plainToClass(CreateCategoryDto, payload);      
            const validatedCategory: CreateCategoryDto = await categoriesService.validationCategory(createCategoryDto);

            if (validatedCategory.description === undefined) validatedCategory.description = category.description;

            const updatedCategory = ({
                id: category.id!,
                name: validatedCategory.name!,
                description: validatedCategory.description!
            });

            const positionCategory = categories.findIndex(category => category.id === +id);
            categories[positionCategory] = updatedCategory;

            return res.status(201).send(updatedCategory);
            
        } catch (error) {

            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));

        }

    };

    public deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    
        try {

            const { id } = req.params;

            const existsCategory: Category = await categoriesService.getCategoryById(+id);

            const positionWords = words.filter(word => word.categoryId === +id);
            positionWords.forEach(word => {
                const positionWord = words.findIndex(word => word.categoryId === +id);
                words.splice(positionWord, 1);
            });
            
            const positionCategory = categories.findIndex(category => category.id === +id);
            categories.splice(positionCategory, 1);

            return res.status(200).send(`The category '${existsCategory.name} (${id})' deleted successfully!`)

        } catch (error) {
            
            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));
           
        }

    };

}

export default new CategoryController();
