import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TurnContext, RecognizerResult } from 'botbuilder';
import { LuisRecognizer, LuisApplication } from 'botbuilder-ai';
import { BotConfiguration, ILuisService } from 'botframework-config';
import TYPES from '../types';
import { IEnvironmentConfig } from '../config';
import ILuisIAService from './ILuisIAService';

@injectable()
class LuisIAService implements ILuisIAService {
    private luisRecognizer!: LuisRecognizer;
    private botPathFile: string;

    constructor(@inject(TYPES.IEnvironmentConfig) environmentConfig: IEnvironmentConfig) {
        this.botPathFile = environmentConfig.BOT_FILE;
    }

    public connect(serviceNameOrId: string) {
        const botConfig = BotConfiguration.loadSync(this.botPathFile);
        const config = botConfig.findServiceByNameOrId(serviceNameOrId) as ILuisService;
        const application: LuisApplication = {
            applicationId: config.appId,
            endpointKey: config.authoringKey,
        };

        this.luisRecognizer = new LuisRecognizer(application);
    }

    public recognize(context: TurnContext): Promise<RecognizerResult> {
        try {
            if (!this.luisRecognizer) {
                throw new Error('Luis recognizer is undefined');
            }

            return this.luisRecognizer.recognize(context);
        } catch (err) {
            throw err;
        }
    }

    public topIntent(results: RecognizerResult, defaultIntent?: string, minScore?: number): string {
        try {
            if (!this.luisRecognizer) {
                throw new Error('Luis recognizer is undefined');
            }

            return LuisRecognizer.topIntent(results, defaultIntent, minScore);
        } catch (err) {
            throw err;
        }
    }

    public getEntityValue(recognizeResult: RecognizerResult, entityName: string): string {
        let value = '';

        if (recognizeResult.entities[entityName]) {
            if (Array.isArray(recognizeResult.entities[entityName][0])) {
                value = recognizeResult.entities[entityName][0][0];
            } else {
                value = recognizeResult.entities[entityName][0];
            }
        }

        return value.trim();
    }
}

export default LuisIAService;
