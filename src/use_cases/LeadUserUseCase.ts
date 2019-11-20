import 'reflect-metadata';
import { TurnContext, RecognizerResult } from 'botbuilder';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import LeadUser from '../entities/LeadUser';
import ILeadUserRepository from '../repositories/ILeadUserRepository';
import ILeadUserUseCase from './ILeadUserUseCase';
import ILuisIAService from '../services/ILuisIAService';

@injectable()
class LeadUserUseCase implements ILeadUserUseCase {
    private leadUserRepository: ILeadUserRepository;
    private luisIAService: ILuisIAService;

    constructor(
        @inject(TYPES.ILeadUserRepository) leadUserRepository: ILeadUserRepository,
        @inject(TYPES.ILuisIAService) luisIAService: ILuisIAService) {
        this.leadUserRepository = leadUserRepository;
        this.luisIAService = luisIAService;
    }

    public async updateUsername(turnContext: TurnContext, recognizeResult: RecognizerResult) {
        const user = await this.leadUserRepository.get(turnContext);
        const username = this.luisIAService.getEntityValue(recognizeResult, 'username');

        if (username) {
            user.username = username;
            await this.leadUserRepository.save(turnContext, user);
        }
    }

    public saveLeadUser(context: TurnContext, leadUser: LeadUser) {
        return this.leadUserRepository.save(context, leadUser);
    }

    public getLeadUser(context: TurnContext): Promise<LeadUser> {
        return this.leadUserRepository.get(context);
    }

    public async saveCareerForUser(context: TurnContext, career: string): Promise<boolean> {
        const leadUser = await this.getLeadUser(context);
        leadUser.career = career;
        return this.leadUserRepository.save(context, leadUser);
    }
}

export default LeadUserUseCase;
