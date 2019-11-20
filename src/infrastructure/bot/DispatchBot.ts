import { TurnContext, ConversationState, UserState, ActivityTypes } from 'botbuilder';
import ILuisIAService from '../../services/ILuisIAService';
import GreetingBot from './GreetingsBot';
import FAQBot from './FAQBot';
import RequestUserInfoBot from './RequestUserInfoBot';
import { checkMembersAdded } from './welcome';
import { DialogTurnStatus } from 'botbuilder-dialogs';
import intents from '../../services/intents';

class DispatchBot {
    private conversationState: ConversationState;
    private userState: UserState;
    private luisIAService: ILuisIAService;
    private greetingBot: GreetingBot;
    private faqBot: FAQBot;
    private requestUserInfoBot: RequestUserInfoBot;

    constructor(conversationState: ConversationState, userState: UserState, luisIAService: ILuisIAService) {
        this.conversationState = conversationState;
        this.userState = userState;
        this.luisIAService = luisIAService;
        this.luisIAService.connect('iacc-luis');
        this.greetingBot = new GreetingBot(this.conversationState, this.userState);
        this.faqBot = new FAQBot(this.conversationState);
        this.requestUserInfoBot = new RequestUserInfoBot(this.conversationState);
    }

    public onTurn = async (turnContext: TurnContext) => {
        switch (turnContext.activity.type) {
            case ActivityTypes.Typing:
                break;
            case ActivityTypes.Message:
                const dialogStatusUserBot = await this.requestUserInfoBot.getDialogTurnResult(turnContext);
                console.info('results 2', dialogStatusUserBot);

                if (dialogStatusUserBot.status === DialogTurnStatus.empty) {
                    const results = await this.luisIAService.recognize(turnContext);
                    const topIntent = this.luisIAService.topIntent(results);
                    console.info('topIntent', topIntent);

                    switch (topIntent) {
                        case intents.GREETING:
                            await this.greetingBot.onTurn(turnContext, results);
                            break;
                        case intents.GET_INFO:
                        case intents.GET_MORE_INFO:
                        case intents.GET_CAREER_INFO:
                        case intents.I_CHITCHAT:
                            await this.faqBot.onTurn(turnContext, results, topIntent);
                            break;
                        case intents.REQUEST_CAREER_CURRICULUM:
                        case intents.INFO_USER_EMAIL:
                        case intents.GET_CAREER_COST:
                            await this.requestUserInfoBot.onTurn(turnContext, results, topIntent);
                            break;
                        case intents.NONE:
                        default:
                            await turnContext.sendActivity('Lo siento, no puedo entender eso');
                            await turnContext.sendActivity(`Si tiene algunas dudas o preguntas sobre IACC.
                        Por favor, hágamolo saber`);
                    }
                }

                break;

            case ActivityTypes.ConversationUpdate:
                const membersAdded = turnContext.activity.membersAdded;
                const botMember = turnContext.activity.recipient;
                const isBotMember = checkMembersAdded(membersAdded, botMember);

                if (isBotMember) {
                    await turnContext.sendActivity('Hola, ¿en qué te puedo ayudar?');
                }

                break;
            default:
                await turnContext.sendActivity(`[${turnContext.activity.type} event detected]`);
        }

        await this.userState.saveChanges(turnContext);
        await this.conversationState.saveChanges(turnContext);
    }
}

export default DispatchBot;
