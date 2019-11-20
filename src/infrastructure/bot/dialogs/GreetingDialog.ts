import { ComponentDialog, WaterfallDialog } from 'botbuilder-dialogs';
import { container } from '../../../inversify.config';
import TYPES from '../../../types';
import ILeadUserUseCase from '../../../use_cases/ILeadUserUseCase';
import IQuestionsUseCase from '../../../use_cases/IQuestionsUseCase';

class GreetingDialog extends ComponentDialog {
    public static DIALOG_NAME = 'greeting_dialog';
    private leadUserUseCase: ILeadUserUseCase;
    private questionsUseCase: IQuestionsUseCase;

    constructor(id: string) {
        super(id);
        this.leadUserUseCase = container.get<ILeadUserUseCase>(TYPES.ILeadUserUseCase);
        this.questionsUseCase = container.get<IQuestionsUseCase>(TYPES.IQuestionsUseCase);

        this.addDialog(new WaterfallDialog(GreetingDialog.DIALOG_NAME, [
            this.displayGreeting.bind(this),
        ]));
    }

    public async displayGreeting(stepContext) {
        await this.leadUserUseCase.updateUsername(stepContext.context, stepContext.options);
        const user = await this.leadUserUseCase.getLeadUser(stepContext.context);
        let reply: string;

        if (user.username) {
            reply = `¡Hola ${user.username}! ¿en qué puedo ayudarte?`;
        } else {
            const result = await this.questionsUseCase.answerChitchat(stepContext.context);
            reply = result.message;

            if (!reply) {
                reply = `¡Hola! ¿en qué puedo ayudarte?`;
            }
        }

        await stepContext.context.sendActivity(reply);
        return await stepContext.endDialog();
    }
}

export default GreetingDialog;
