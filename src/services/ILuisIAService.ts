import { TurnContext, RecognizerResult } from 'botbuilder';

interface ILuisIAService {
    connect(serviceNameOrId: string): void;
    recognize(context: TurnContext): Promise<RecognizerResult>;
    topIntent(results: RecognizerResult, defaultIntent?: string, minScore?: number): string;
    getEntityValue(recognizeResult: RecognizerResult, entityName: string): string;
}

export default ILuisIAService;
