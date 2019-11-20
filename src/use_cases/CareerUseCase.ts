import { TurnContext } from 'botbuilder';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import ILuisIAService from '../services/ILuisIAService';
import ICareerUseCase from './ICareerUseCase';

@injectable()
class CareerUseCase implements ICareerUseCase {
    private luisIAService: ILuisIAService;

    constructor(
        @inject(TYPES.ILuisIAService) luisIAService: ILuisIAService) {
        this.luisIAService = luisIAService;
        this.luisIAService.connect('iacc-luis');
    }

    public async retrieveCareerName(context: TurnContext): Promise<string> {
        const recognizerResult = await this.luisIAService.recognize(context);
        const careerName = this.luisIAService.getEntityValue(recognizerResult, 'career_list');
        return careerName;
    }
}

export default CareerUseCase;
