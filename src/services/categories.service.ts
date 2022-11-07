
import { CreateCategoryDto } from "../dtos/create_category.dto";
import { Category } from "../models/category.model";
import { validate } from "class-validator";

import categories from "../files_json/categories.json";

interface ICategories {
    count: number,
    results: any[]
}

class CategoriesService {

    public getCategories = async (): Promise<ICategories> => {

        const searchAllCategories = categories;

        if (searchAllCategories.length === 0) throw new Error('There are no categories added!');
        
        return {
            count: searchAllCategories.length,
            results: searchAllCategories
        };
        
    };

    public getCategoryById = async (id: number): Promise<any> => {

        const searchCategory = categories.find(category => category.id === id);
        
        if (searchCategory === undefined) throw new Error('Category is not exists!');

        return searchCategory;

    };

    public getCategoryByName = async (name: string): Promise<any> => {

        const searchCategory = categories.find(category => category.name === name);

        return searchCategory;

    };

    public validationCategory = async (category: CreateCategoryDto): Promise<CreateCategoryDto> => {
        
        const errors = await validate(category).then(errors => {
            
            if (errors.length > 0) {

                let constraints: any = [];

                errors.forEach(err => {

                    constraints.push({ 

                        'Property': err.property, 
                        'Errors': err.constraints 

                    });
                  
                });

                return constraints;

            }

        });

        if (typeof errors !== 'undefined') throw new Error(JSON.stringify(errors)); 

        const existsCategory = await this.getCategoryByName(category.name!);

        if (existsCategory !== undefined) throw new Error('The category already exists!');

        return category;

    };

}

export default new CategoriesService();
