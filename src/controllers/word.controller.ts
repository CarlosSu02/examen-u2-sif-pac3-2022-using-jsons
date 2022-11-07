
import { Request, Response } from "express";
import { Word } from "../models/word.model";
import { CreateWordDto } from "../dtos/create_word.dto";
import { plainToClass } from "class-transformer";
import wordsService from "../services/words.service";

import words from '../files_json/words.json';

class WordController {

    public getWords = async (req: Request, res: Response): Promise<Response> => {
    
        try {

            const words = await wordsService.getWords();
            
            return res.status(200).send(words);
                        
        } catch (error) {
            
            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));
            
        }

    };
    
    public getWordById = async (req: Request, res: Response): Promise<Response> => {
    
        try {
            const { id } = req.params;

            const word: Word = await wordsService.getWordById(+id);

            return res.status(200).send(word);

        } catch (error) {

            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));

        }

    };

    public createWord = async (req: Request, res: Response): Promise<Response> => {
    
        try {
         
            const payload: any = req.body;

            const createWordDto: CreateWordDto = plainToClass(CreateWordDto, payload);      
            const validatedWord: CreateWordDto = await wordsService.validationWord(createWordDto);

            const newWord = ({
                id: Math.max(...words.map(d => d.id)) + 1,
                name: validatedWord.name!,
                categoryId: validatedWord.categoryId!,
            });

            words.push(newWord);

            return res.status(201).send(newWord);

        } catch (error) {

            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));

        }

    };

    public updateWord = async (req: Request, res: Response): Promise<Response> => {
    
        try {
         
            const { id } = req.params;
            const payload: any = req.body;

            const word: Word = await wordsService.getWordById(+id);

            const createWordDto: CreateWordDto = plainToClass(CreateWordDto, payload);      
            const validatedWord: CreateWordDto = await wordsService.validationWord(createWordDto);

            const updatedWord = ({
                id: word.id!,
                name: validatedWord.name!,
                categoryId: validatedWord.categoryId!
            });

            const positionWord = words.findIndex(word => word.id === +id);
            words[positionWord] = updatedWord;

            return res.status(201).send(word);

        } catch (error) {

            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));

        }

    };

    public deleteWord = async (req: Request, res: Response): Promise<Response> => {
    
        try {
            
            const { id } = req.params;

            const existsWord: Word = await wordsService.getWordById(+id);
            
            const positionWord = words.findIndex(word => word.id === +id);
            words.splice(positionWord, 1);

            return res.status(200).send(`The category '${existsWord.name} (${id})' deleted successfully!`)

        } catch (error) {
            
            return (error instanceof Error) ? res.status(400).send(error.message) : res.status(400).send(String(error));
           
        }

    };

    // Insert words from Array
    public createWordsFromArray = async () => {

        try {

            const countWords: number = await Word.findAndCountAll().then(info => info.count);

            if (countWords === 0) {
               
                console.log(`Insert words in database from Array`);

                words.forEach(async (word) => {

                    const createWordDto = plainToClass(CreateWordDto, word);      
                    const validatedWord = await wordsService.validationWord(createWordDto);

                    await Word.create({

                        ...validatedWord

                    });

                });

            }
            
        } catch (error) {
            
            (error instanceof Error) ? console.log('Errors: ', error.message) : console.log(String(error));
   
        }

    };

}

export default new WordController();
