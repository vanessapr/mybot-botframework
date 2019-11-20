import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import IBot from '../infrastructure/bot/IBot';
import IMessageUseCase from './IMessageUseCase';

@injectable()
class MessageUseCase implements IMessageUseCase {
    private bot: IBot;

    constructor(@inject(TYPES.IBot) bot: IBot) {
        this.bot = bot;
    }

    public processMessage(request, response) {
        const adapter = this.bot.getAdapter();
        // Route to main dialog
        adapter.processActivity(request, response, async (context) => {
            await this.bot.onTurn(context);
        });
    }
}

export default MessageUseCase;
