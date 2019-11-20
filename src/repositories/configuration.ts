import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { MemoryStorage, UserState, ConversationState, TurnContext } from 'botbuilder';
import { CosmosDbStorage } from 'botbuilder-azure';
import TYPES from '../types';
import { IEnvironmentConfig } from '../config';

export interface IDatabase {
    userState: UserState;
    conversationState: ConversationState;
    remove(context: TurnContext): void;
}

@injectable()
export class Database implements IDatabase {
    public userState: UserState;
    public conversationState: ConversationState;

    constructor(@inject(TYPES.IEnvironmentConfig) environmentConfig: IEnvironmentConfig) {
        const memoryStorage = new MemoryStorage();
        // const storage = new CosmosDbStorage({
        //     authKey: environmentConfig.DB_AUTH_KEY,
        //     collectionId: environmentConfig.DB_COLLECTION,
        //     databaseId: environmentConfig.DB_NAME,
        //     serviceEndpoint: environmentConfig.DB_SERVICE_ENDPOINT,
        // });

        this.conversationState = new ConversationState(memoryStorage);
        this.userState = new UserState(memoryStorage);
    }

    public async remove(turnContext: TurnContext) {
        // Clear out state
        await this.userState.load(turnContext);
        await this.userState.clear(turnContext);
        await this.conversationState.load(turnContext);
        await this.conversationState.clear(turnContext);
        // save state changes
        await this.conversationState.saveChanges(turnContext);
        await this.userState.saveChanges(turnContext);
    }
}
