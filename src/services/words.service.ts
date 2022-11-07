
import { validate } from "class-validator";
import { CreateWordDto } from "../dtos/create_word.dto";
import categoriesService from "./categories.service";

import words from "../files_json/words.json";

interface IWords {
    categoryName?: string,
    count: number,
    results: any[]
}

class WordsService {

    public getWords = async (): Promise<IWords> => {

        const searchAllWords = words;

        if (searchAllWords.length === 0) throw new Error('There are no words added!');
        
        return {
            count: searchAllWords.length,
            results: searchAllWords
        };
        
    };

    public getWordById = async (id: number): Promise<any> => {

        const searchWord = words.find(word => word.id === id);

        if (searchWord === undefined) throw new Error('Word is not exists!');

        return searchWord;

    };

    public getWordByName = async (name: string): Promise<any> => {

        const searchWord = words.filter(word => word.name === name);

        return searchWord;

    };

    public getWordsCategory = async (id: number): Promise<IWords> => {

        const searchAllWordsCategory = words.filter(word => word.categoryId === id);
        
        const categoryName = await categoriesService.getCategoryById(id).then(info => info.name);                                               

        if (searchAllWordsCategory.length === 0) throw new Error('There are no words added!');
        
        return {
            categoryName,
            count: searchAllWordsCategory.length,
            results: searchAllWordsCategory
        };
        
    };

    public validationWord = async (word: CreateWordDto): Promise<CreateWordDto> => {
        
        const errors = await validate(word).then(errors => {
            
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

        const existsWord = await this.getWordByName(word.name!);

        if (existsWord !== undefined) throw new Error('The word already exists in other category!');

        await categoriesService.getCategoryById(word.categoryId!);

        return word;

    };

}

export default new WordsService();
