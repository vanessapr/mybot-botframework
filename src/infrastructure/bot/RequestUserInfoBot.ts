import { ConversationState, StatePropertyAccessor, TurnContext, RecognizerResult } from 'botbuilder';
import { DialogSet, DialogTurnResult, WaterfallDialog } from 'botbuilder-dialogs';
import { container } from '../../inversify.config';
import TYPES from '../../types';
import intents from '../../services/intents';
import ILeadUserUseCase from '../../use_cases/ILeadUserUseCase';
import ICareerUseCase from '../../use_cases/ICareerUseCase';
import RegisterCareerDialog from './dialogs/RegisterCareerDialog';
import CareerCurriculumDialog from './dialogs/CareerCurriculumDialog';
import CareerCostDialog from './dialogs/CareerCostDialog';
import GoodByeDialog from './dialogs/GoodByeDialog';
import { generateId } from './utils';

class RequestUserInfoBot {
    private static DIALOG_STATE_ACCESSOR = 'request_user_info_bot_dialog_state_accessor';
    private static MAIN_DIALOG = 'request_user_info_bot_main_dialog';
    private conversationState: ConversationState;
    private dialogStateAccessor: StatePropertyAccessor;
    private leadUserUseCase: ILeadUserUseCase;
    private careerUseCase: ICareerUseCase;
    private topIntent!: string;
    private dialogSet: DialogSet;
    private goodByeDialogId: string;
    private registerCareerDialogId: string;
    private careerCurriculumDialogId: string;
    private careerCostDialogId: string;
    private checkCareerDialogId: string;

    constructor(conversationState: ConversationState) {
        this.conversationState = conversationState;
        this.leadUserUseCase = container.get<ILeadUserUseCase>(TYPES.ILeadUserUseCase);
        this.careerUseCase = container.get<ICareerUseCase>(TYPES.ICareerUseCase);
        this.goodByeDialogId = generateId(GoodByeDialog.name);
        this.registerCareerDialogId = generateId(RegisterCareerDialog.name);
        this.careerCurriculumDialogId = generateId(CareerCurriculumDialog.name);
        this.careerCostDialogId = generateId(CareerCostDialog.name);
        this.checkCareerDialogId = generateId();

        this.dialogStateAccessor = this.conversationState.createProperty(RequestUserInfoBot.DIALOG_STATE_ACCESSOR);
        this.dialogSet = new DialogSet(this.dialogStateAccessor)
            .add(new RegisterCareerDialog(this.registerCareerDialogId, RequestUserInfoBot.MAIN_DIALOG))
            .add(new CareerCurriculumDialog(this.careerCurriculumDialogId, RequestUserInfoBot.MAIN_DIALOG))
            .add(new CareerCostDialog(this.careerCostDialogId))
            .add(new GoodByeDialog(this.goodByeDialogId))
            .add(new WaterfallDialog(this.checkCareerDialogId, [
                this.checkCareer.bind(this),
                this.startChildDialog.bind(this),
            ]))
            .add(new WaterfallDialog(RequestUserInfoBot.MAIN_DIALOG, [
                this.startParentDialog.bind(this),
                this.finalStep.bind(this),
            ]));
    }

    public async getDialogTurnResult(turnContext: TurnContext): Promise<DialogTurnResult> {
        const dialogContext = await this.dialogSet.createContext(turnContext);
        return await dialogContext.continueDialog();
    }

    public onTurn = async (turnContext: TurnContext, recognizeResult: RecognizerResult, topIntent: string) => {
        this.topIntent = topIntent;
        const dialogContext = await this.dialogSet.createContext(turnContext);
        await dialogContext.beginDialog(RequestUserInfoBot.MAIN_DIALOG, recognizeResult);
    }

    public async checkCareer(stepContext) {
        const leadUser = await this.leadUserUseCase.getLeadUser(stepContext.context);

        if (!leadUser.career) {
            return await stepContext.beginDialog(this.registerCareerDialogId);
        }

        return await stepContext.continueDialog();
    }

    public async startChildDialog(stepContext) {
        const { dialogId } = stepContext.options;

        switch (dialogId) {
            case 'CAREER_COST':
                return await stepContext.beginDialog(this.careerCostDialogId);
            case 'CAREER_CURRICULUM':
                return await stepContext.beginDialog(this.careerCurriculumDialogId);
        }
    }

    public async startParentDialog(stepContext) {
        const careerName = await this.careerUseCase.retrieveCareerName(stepContext.context);
        const leadUser = await this.leadUserUseCase.getLeadUser(stepContext.context);
        // console.log('this.intent', this.topIntent);

        if (careerName) {
            await this.leadUserUseCase.saveCareerForUser(stepContext.context, careerName);
        }

        switch (this.topIntent) {
            case intents.INFO_USER_EMAIL:
                const email = stepContext.context.activity.text;
                leadUser.email = email;
                await this.leadUserUseCase.saveLeadUser(stepContext.context, leadUser);
                const msg = leadUser.username ? `¡Muchas gracias ${leadUser.username}!` : '¡Muchas gracias!';
                await stepContext.context.sendActivity(msg);
                // TODO: optional
                return await stepContext.beginDialog(this.registerCareerDialogId, { displayMessage: true });
            case intents.REQUEST_CAREER_CURRICULUM:
                return await stepContext.beginDialog(this.checkCareerDialogId, {
                    dialogId: 'CAREER_CURRICULUM',
                });
            case intents.GET_CAREER_COST:
                return await stepContext.beginDialog(this.checkCareerDialogId, {
                    dialogId: 'CAREER_COST',
                });
        }
    }

    public async finalStep(stepContext) {
        if (stepContext.result && stepContext.result.value === 'No') {
            await stepContext.beginDialog(this.goodByeDialogId);
        } else {
            await stepContext.context.sendActivity('Cuéntame ¿En qué más te puedo ayudar?.');
        }

        return await stepContext.endDialog(stepContext.result);
    }
}

export default RequestUserInfoBot;
