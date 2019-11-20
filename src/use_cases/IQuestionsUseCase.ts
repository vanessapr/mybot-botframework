import { TurnContext, RecognizerResult } from 'botbuilder';
import { IAnswer } from '../entities/Answer';

interface IQuestionsUseCase {
    answerFAQ(context: TurnContext, recognizeResult: RecognizerResult): Promise<IAnswer>;
    answerChitchat(context: TurnContext): Promise<IAnswer>;
}

export default IQuestionsUseCase;
