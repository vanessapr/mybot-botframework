import { ConversationState, UserState, StatePropertyAccessor, TurnContext,
    ActivityTypes, RecognizerResult } from 'botbuilder';
import { DialogSet } from 'botbuilder-dialogs';
import GreetingDialog from './dialogs/GreetingDialog';

class GreetingsBot {
    private static DIALOG_STATE_ACCESSOR = 'greeting_bot_dialog_state_accessor';
    private conversationState: ConversationState;
    private userState: UserState;
    private dialogStateAccessor: StatePropertyAccessor;
    private dialogSet: DialogSet;

    constructor(conversationState: ConversationState, userState: UserState) {
        this.conversationState = conversationState;
        this.userState = userState;

        this.dialogStateAccessor = this.conversationState.createProperty(GreetingsBot.DIALOG_STATE_ACCESSOR);
        this.dialogSet = new DialogSet(this.dialogStateAccessor)
            .add(new GreetingDialog(GreetingDialog.DIALOG_NAME));
    }

    public onTurn = async (turnContext: TurnContext, results: RecognizerResult) => {
        const dialogContext = await this.dialogSet.createContext(turnContext);
        const dialogTurnResult = await dialogContext.continueDialog();

        switch (turnContext.activity.type) {
            case ActivityTypes.Typing:
                break;
            case ActivityTypes.Message:
                await dialogContext.beginDialog(GreetingDialog.DIALOG_NAME, results);
                break;
            default:
                await turnContext.sendActivity('Lo siento, no puedo entender eso');
                await turnContext.sendActivity(`Si tiene algunas dudas o preguntas sobre IACC.
                        Por favor, hágamolo saber`);
        }
    }
}

export default GreetingsBot;
