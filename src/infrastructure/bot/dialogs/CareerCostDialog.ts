import { ComponentDialog, TextPrompt, ChoicePrompt, WaterfallDialog } from 'botbuilder-dialogs';
import { container } from '../../../inversify.config';
import TYPES from '../../../types';
import ILeadUserUseCase from '../../../use_cases/ILeadUserUseCase';

class CareerCostDialog extends ComponentDialog {
    private static TEXT_EMAIL_OR_PHONE_PROMPT = 'text_email_phone_prompt';
    private static CHOICE_EMAIL_OR_PHONE_PROMPT = 'choice_email_phone_prompt';
    private static CHOICE_PROMPT = 'choice_prompt';
    private media!: string;
    private leadUserUseCase: ILeadUserUseCase;

    constructor(id: string) {
        super(id);
        this.initialDialogId = 'mainDialog';
        this.leadUserUseCase = container.get<ILeadUserUseCase>(TYPES.ILeadUserUseCase);

        this.addDialog(new ChoicePrompt(CareerCostDialog.CHOICE_EMAIL_OR_PHONE_PROMPT))
            .addDialog(new TextPrompt(CareerCostDialog.TEXT_EMAIL_OR_PHONE_PROMPT,
                this.emailOrPhoneValidator.bind(this)))
            .addDialog(new ChoicePrompt(CareerCostDialog.CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog('mainDialog', [
            this.choiceEmailOrPhone.bind(this),
            this.promptEmailOrPhone.bind(this),
            this.askForAnythingElse.bind(this),
        ]));
    }

    private async emailOrPhoneValidator(promptContext) {
        const re = this.media === 'email' ? /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ : /^[0-9]+$/;

        if (!promptContext.recognized.succeeded || !re.test(promptContext.recognized.value)) {
            await promptContext.context.sendActivity('Lo siento, no puedo entenderlo.');
            await promptContext.context.sendActivity(promptContext.options.retryPrompt);
            return false;
        }

        return true;
    }

    public async choiceEmailOrPhone(stepContext) {
        return await stepContext.prompt(CareerCostDialog.CHOICE_EMAIL_OR_PHONE_PROMPT, {
            choices: ['Email', 'Teléfono'],
            prompt: `Te puedo poner en contacto con un ejecutivo que te dará más información sobre los aranceles.
                ¿Por donde prefieres que te contacte?`,
            retryPrompt: 'Por favor, eliga email o teléfono.',
        });
    }

    public async promptEmailOrPhone(stepContext) {
        const leadUser = await this.leadUserUseCase.getLeadUser(stepContext.context);
        this.media = stepContext.result.value.toLowerCase();

        if (leadUser.email) {
            return await stepContext.continueDialog();
        }

        return await stepContext.prompt(CareerCostDialog.TEXT_EMAIL_OR_PHONE_PROMPT, {
            prompt: `¿Cuál es su ${this.media}?`,
            retryPrompt: `Por favor, escriba un ${this.media} válido`,
        });
    }

    public async askForAnythingElse(stepContext) {
        const reply = `Perfecto, un ejecutivo te contactará al ${this.media} que nos indicaste.
            ¿Te gustaría saber algo más?`;

        return await stepContext.prompt(CareerCostDialog.CHOICE_PROMPT, {
            choices: ['Si', 'No'],
            prompt: reply,
            retryPrompt: 'Por favor, eliga una opción antes de continuar.',
        });
    }
}

export default CareerCostDialog;
