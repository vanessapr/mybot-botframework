import { TurnContext, ConversationState, StatePropertyAccessor,
    RecognizerResult } from 'botbuilder';
import { DialogSet, WaterfallDialog, DialogTurnStatus } from 'botbuilder-dialogs';
import GetAnwserFAQDialog from './dialogs/GetAnswerFAQDialog';
import { container } from '../../inversify.config';
import TYPES from '../../types';
import intents from '../../services/intents';
import ILeadUserUseCase from '../../use_cases/ILeadUserUseCase';
import ICareerUseCase from '../../use_cases/ICareerUseCase';

class FAQBot {
    private static DIALOG_STATE_ACCESSOR = 'faq_bot_dialog_state_accessor';
    private static MAIN_DIALOG = 'faq_bot_main_dialog';
    private conversationState: ConversationState;
    private dialogStateAccessor: StatePropertyAccessor;
    private dialogSet: DialogSet;
    private topIntent!: string;
    private leadUserUseCase: ILeadUserUseCase;
    private careerUseCase: ICareerUseCase;

    constructor(conversationState: ConversationState) {
        this.conversationState = conversationState;
        this.leadUserUseCase = container.get<ILeadUserUseCase>(TYPES.ILeadUserUseCase);
        this.careerUseCase = container.get<ICareerUseCase>(TYPES.ICareerUseCase);

        this.dialogStateAccessor = this.conversationState.createProperty(FAQBot.DIALOG_STATE_ACCESSOR);

        this.dialogSet = new DialogSet(this.dialogStateAccessor)
            .add(new GetAnwserFAQDialog(GetAnwserFAQDialog.DIALOG_NAME, FAQBot.MAIN_DIALOG))
            .add(new WaterfallDialog(FAQBot.MAIN_DIALOG, [
                this.displayAnswer.bind(this),
            ]));
    }

    public onTurn = async (context: TurnContext, recognizeResult: RecognizerResult, topIntent: string) => {
        this.topIntent = topIntent;
        const dialogContext = await this.dialogSet.createContext(context);
        const dialogTurnResult = await dialogContext.continueDialog();

        switch (dialogTurnResult.status) {
            case DialogTurnStatus.empty:
                await dialogContext.beginDialog(FAQBot.MAIN_DIALOG, recognizeResult);
                break;
            case DialogTurnStatus.complete:
                break;
        }
    }

    public async displayAnswer(stepContext) {
        const leadUser = await this.leadUserUseCase.getLeadUser(stepContext.context);
        const options = {
            recognizerResult: stepContext.options,
            topIntent: this.topIntent,
        };

        await stepContext.beginDialog(GetAnwserFAQDialog.DIALOG_NAME, options);

        if (this.topIntent === intents.GET_MORE_INFO) {
            if (!leadUser.email) {
                await stepContext.context.sendActivities([
                    { type: 'typing' },
                    { type: 'delay', value: 2000 },
                    {
                        text: 'Si quieres saber más de alguna de nuestras carreras o diplomados' +
                            ', escribe tu email',
                        type: 'message',
                    },
                ]);
            }
        } else if (this.topIntent === intents.GET_CAREER_INFO) {
            const careerName = await this.careerUseCase.retrieveCareerName(stepContext.context);

            if (careerName) {
                await this.leadUserUseCase.saveCareerForUser(stepContext.context, careerName);
            }
        } else if (this.topIntent === intents.GET_INFO) {
            if (!leadUser.career) {
                await stepContext.context.sendActivities([
                    { type: 'typing' },
                    { type: 'delay', value: 2000 },
                    {
                        text: '¿Te interesa estudiar algo en especial?',
                        type: 'message',
                    },
                ]);
            }
        }

        return await stepContext.endDialog();
    }
}

export default FAQBot;
