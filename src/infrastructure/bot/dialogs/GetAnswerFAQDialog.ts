import { ComponentDialog, WaterfallDialog } from 'botbuilder-dialogs';
import { container } from '../../../inversify.config';
import TYPES from '../../../types';
import IQuestionsUseCase from '../../../use_cases/IQuestionsUseCase';
import intents from '../../../services/intents';
import { IAnswer } from 'entities/Answer';

class GetAnswerFAQDialog extends ComponentDialog {
    public static DIALOG_NAME = 'get_answer_dialog';
    private questionsUseCase: IQuestionsUseCase;

    constructor(id: string, initialDialogId: string) {
        super(id);
        this.initialDialogId = initialDialogId;
        this.questionsUseCase = container.get<IQuestionsUseCase>(TYPES.IQuestionsUseCase);

        this.addDialog(new WaterfallDialog(initialDialogId, [
            this.finalStep.bind(this),
        ]));
    }

    public async finalStep(stepContext) {
        let reply: IAnswer;

        if (stepContext.options.topIntent === intents.I_CHITCHAT) {
            reply = await this.questionsUseCase.answerChitchat(stepContext.context);
        } else {
            reply = await this.questionsUseCase.answerFAQ(stepContext.context, stepContext.options.recognizerResult);
        }

        await stepContext.context.sendActivity(reply.message);

        if (reply.type === 'NO_FOUND') {
            await stepContext.context.sendActivities([
                { type: 'typing' },
                { type: 'delay',  value: 2000 },
                {
                    text: 'Si tiene algunas dudas o preguntas sobre IACC. ' +
                    'Por favor, hágamelo saber',
                    type: 'message',
                },
            ]);
        }

        return await stepContext.endDialog();
    }
}

export default GetAnswerFAQDialog;
