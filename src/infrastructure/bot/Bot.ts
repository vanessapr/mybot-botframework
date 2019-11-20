import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TurnContext } from 'botbuilder';
import TYPES from '../../types';
import IBot from './IBot';
import { IEnvironmentConfig } from '../../config';
import { IDatabase } from '../../repositories/configuration';
import BotAdapter from './BotAdapter';
import ILuisIAService from '../../services/ILuisIAService';
import DispatchBot from './DispatchBot';

@injectable()
class Bot implements IBot {
    private appId: string;
    private appPassword: string;
    private dispatchBot: DispatchBot;
    private database: IDatabase;

    constructor(
        @inject(TYPES.IEnvironmentConfig) environmentConfig: IEnvironmentConfig,
        @inject(TYPES.IDatabase) database: IDatabase,
        @inject(TYPES.ILuisIAService) luisIAService: ILuisIAService) {
        this.appId = environmentConfig.MICROSOFT_APP_ID;
        this.appPassword = environmentConfig.MICROSOFT_APP_PWD;
        this.database = database;

        this.dispatchBot = new DispatchBot(database.conversationState, database.userState, luisIAService);
    }

    public onTurn = async (turnContext: TurnContext) => {
        await this.dispatchBot.onTurn(turnContext);
    }

    public getAdapter() {
        const adapter = new BotAdapter(this.appId, this.appPassword, this.database);
        return adapter.create();
    }
}

export default Bot;
