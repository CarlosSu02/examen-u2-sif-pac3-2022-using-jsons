
import { validate } from "class-validator";
import { Statistic } from "../models/game.model";
import { WordPetitionDto } from "../dtos/word_petition.dto";

import statistics from "../files_json/statistics.json";

interface IGames {
    count: number,
    results: any[]
}


class GameService {

    public getStatistics = async ():  Promise<IGames> => {

        const searchAllStatistics = statistics;

        if (searchAllStatistics.length === 0) throw new Error('There are no games added!');
        
        return {
            count: searchAllStatistics.length,
            results: searchAllStatistics
        };
        
    
    }

    public getStatistic = async (): Promise<any> => {

        const searchStatistic = statistics.find(statistic => statistic.completed === false);

        if (searchStatistic === undefined) return searchStatistic;
        
        return searchStatistic;
        
    };

    public validationWord = async (word: WordPetitionDto, progress: string): Promise<WordPetitionDto> => {
        
        const errors = await validate(word).then(errors => {
            
            if (errors.length > 0) {

                let constraints: any = [];

                errors.forEach(err => {

                    constraints.push({ 

                        'Property': err.property, 
                        'Errors': err.constraints,
                        'Message': `Enter a new letter to continue the game! Progress '${progress}'`

                    });
                  
                });

                return constraints;

            }

        });

        if (typeof errors !== 'undefined') throw new Error(JSON.stringify(errors)); 

        return word;

    };

}

export default new GameService();
