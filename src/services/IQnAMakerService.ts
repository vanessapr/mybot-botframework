import { TurnContext } from 'botbuilder';
import { QnAMakerOptions, QnAMakerResult } from 'botbuilder-ai';
import { IAnswer } from '../entities/Answer';

interface IQnAMakerService {
    connect(serviceNameOrId: string, options?: QnAMakerOptions): boolean;
    getAnswers(context: TurnContext, options?: QnAMakerOptions): Promise<IAnswer>;
    generateAnswers(question: string, numberOfAnswers?: number, scoreThreshold?: number): Promise<QnAMakerResult[]>;
}

export default IQnAMakerService;
