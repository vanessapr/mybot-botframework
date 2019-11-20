import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TurnContext } from 'botbuilder';
import { QnAMaker, QnAMakerEndpoint, QnAMakerOptions, QnAMakerResult } from 'botbuilder-ai';
import { BotConfiguration, IQnAService } from 'botframework-config';
import { IEnvironmentConfig } from '../config';
import TYPES from '../types';
import IQnAMakerService from './IQnAMakerService';
import { IAnswer } from '../entities/Answer';

@injectable()
class QnAMakerService implements IQnAMakerService {
    private botPathFile: string;
    private qnaMaker!: QnAMaker;

    constructor(@inject(TYPES.IEnvironmentConfig) environmentConfig: IEnvironmentConfig) {
        this.botPathFile = environmentConfig.BOT_FILE;
    }

    public connect(serviceNameOrId: string, options?: QnAMakerOptions) {
        try {
            const botConfig = BotConfiguration.loadSync(this.botPathFile);
            const config = botConfig.findServiceByNameOrId(serviceNameOrId) as IQnAService;

            const endpoint: QnAMakerEndpoint = {
                endpointKey: config.endpointKey,
                host: config.hostname,
                knowledgeBaseId: config.kbId,
            };

            this.qnaMaker = new QnAMaker(endpoint, options);
            return true;
        } catch (err) {
            throw new TypeError('QnAMaker: config is not defined or config is not valid');
        }
    }

    public async getAnswers(context: TurnContext, options?: QnAMakerOptions): Promise<IAnswer> {
        try {
            const qnaResults = await this.qnaMaker.getAnswers(context, options);
            let answer: IAnswer;

            if (qnaResults.length) {
                answer = {
                    message: qnaResults[0].answer,
                    type: 'SUCCESS',
                };
            } else {
                answer = {
                    message: 'Lo siento. No tengo respuesta para eso.',
                    type: 'NO_FOUND',
                };
            }

            return answer;
        } catch (err) {
            throw new TypeError(`QnAMaker: ${err.message}`);
        }
    }

    public generateAnswers(question: string, numberOfAnswers = 1, scoreThreshold = 0.75): Promise<QnAMakerResult[]> {
        try {
            if (!this.qnaMaker) {
                throw new Error('QnAMaker is not defined');
            }

            return this.qnaMaker.generateAnswer(question, numberOfAnswers, scoreThreshold);
        } catch (err) {
            throw err;
        }
    }
}

export default QnAMakerService;
