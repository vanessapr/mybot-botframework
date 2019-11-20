import { BotFrameworkAdapter } from 'botbuilder';

interface IBot {
    onTurn(turnContext: any): any;
    getAdapter(): BotFrameworkAdapter;
}

export default IBot;
