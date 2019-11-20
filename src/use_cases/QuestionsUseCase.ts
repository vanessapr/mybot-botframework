import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TurnContext, RecognizerResult } from 'botbuilder';
import { QnAMakerOptions, QnAMakerMetadata } from 'botbuilder-ai';
import TYPES from '../types';
import IQnAMakerService from '../services/IQnAMakerService';
import IQuestionsUseCase from './IQuestionsUseCase';
import ILuisIAService from '../services/ILuisIAService';
import { IAnswer } from 'entities/Answer';

@injectable()
class QuestionsUseCase implements IQuestionsUseCase {
    private qnaMakerService: IQnAMakerService;
    private luisIAService: ILuisIAService;

    constructor(
        @inject(TYPES.IQnAMakerService) qnaMaker: IQnAMakerService,
        @inject(TYPES.ILuisIAService) luisIAService: ILuisIAService) {
        this.qnaMakerService = qnaMaker;
        this.qnaMakerService.connect('faq-qna');
        this.luisIAService = luisIAService;
    }
    // * ```JavaScript
    //  * await context.sendActivities([
    //  *    { type: 'typing' },
    //  *    { type: 'delay', value: 2000 },
    //  *    { type: 'message', text: 'Hello... How are you?' }
    //  * ]);

    public answerFAQ(context: TurnContext, recognizeResult: RecognizerResult): Promise<IAnswer> {
        const careerName = this.luisIAService.getEntityValue(recognizeResult, 'career_list');
        // await context.updateActivity(
        //     { ...context.activity, text: 'cual es la duracion para contador auditor' });

        let options: QnAMakerOptions = {};
        if (careerName) {
            options = {
                strictFilters: [{
                    name: 'career',
                    value: careerName,
                }],
            };
        }

        return this.qnaMakerService.getAnswers(context, options);
    }

    public answerChitchat(context: TurnContext): Promise<IAnswer> {
        const options: QnAMakerOptions = {
            strictFilters: [{
                name: 'editorial',
                value: 'chitchat',
            }],
        };

        return this.qnaMakerService.getAnswers(context, options);
    }

    public async generateAnswerFAQ(question: string) {
        const qnaResults = await this.qnaMakerService.generateAnswers(question);
        // TODO: question model, catch the exceptions
        const replyMessage = qnaResults[0] ? qnaResults[0].answer : 'Lo siento. No puedo entenderlo.';
        return replyMessage;
    }

}

export default QuestionsUseCase;
