import { BotFrameworkAdapter } from 'botbuilder';
import { IDatabase } from '../../repositories/configuration';

class BotAdapter {
    private appId: string;
    private appPassword: string;
    private database: IDatabase;

    constructor(appId: string, appPassword: string, database: IDatabase) {
        this.appId = appId;
        this.appPassword = appPassword;
        this.database = database;
    }

    public create(): BotFrameworkAdapter {
        const adapter = new BotFrameworkAdapter({
            appId: this.appId,
            appPassword: this.appPassword,
        });

        adapter.onTurnError = async (context, error) => {
            // This check writes out errors to console log .vs. app insights.
            console.error(`\n [onTurnError]: ${error}`);
            // Send a message to the user
            await context.sendActivity(`Oops. Something went wrong!`);
            await this.database.remove(context);
        };

        return adapter;
    }
}

export default BotAdapter;
