import { ComponentDialog, TextPrompt, ChoicePrompt, WaterfallDialog } from 'botbuilder-dialogs';
import { container } from '../../../inversify.config';
import TYPES from '../../../types';
import ILeadUserUseCase from '../../../use_cases/ILeadUserUseCase';

class CareerCurriculumDialog extends ComponentDialog {
    private static EMAIL_PROMPT = 'email_prompt';
    private static CHOICE_PROMPT = 'choice_prompt';
    private haveEmail = false;
    private leadUserUseCase: ILeadUserUseCase;

    constructor(id: string, initialDialogId: string) {
        super(id);
        this.initialDialogId = initialDialogId;
        this.leadUserUseCase = container.get<ILeadUserUseCase>(TYPES.ILeadUserUseCase);

        this.addDialog(new TextPrompt(CareerCurriculumDialog.EMAIL_PROMPT, this.emailValidator.bind(this)))
            .addDialog(new ChoicePrompt(CareerCurriculumDialog.CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(initialDialogId, [
            this.promptForEmail.bind(this),
            this.askForAnythingElse.bind(this),
        ]));
    }

    private async emailValidator(promptContext) {
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

        if (!promptContext.recognized.succeeded || !re.test(promptContext.recognized.value)) {
            await promptContext.context.sendActivity(promptContext.options.retryPrompt);
            return false;
        }

        return true;
    }

    public async promptForEmail(stepContext) {
        // TODO: tarea para enviar cv a correo
        const leadUser = await this.leadUserUseCase.getLeadUser(stepContext.context);

        if (leadUser.email) {
            this.haveEmail = true;
            return await stepContext.continueDialog();
        }

        return await stepContext.prompt(CareerCurriculumDialog.EMAIL_PROMPT, {
            prompt: 'Para ver la malla curricular, escribe tu email y te enviaré la información.',
            retryPrompt: 'El email proporcionado no es válido. Por favor, intenta de nuevo',
        });
    }

    public async askForAnythingElse(stepContext) {
        const leadUser = await this.leadUserUseCase.getLeadUser(stepContext.context);
        let reply = `Muchas gracias, ¿tienes otra consulta?`;

        if (this.haveEmail) {
            reply = `La malla curricular se te será enviada a: ${leadUser.email}
                ¿tienes otra consulta?`;
        } else {
            const email = stepContext.result;
            leadUser.email = email;
            await this.leadUserUseCase.saveLeadUser(stepContext.context, leadUser);
        }

        return await stepContext.prompt(CareerCurriculumDialog.CHOICE_PROMPT, {
            choices: ['Si', 'No'],
            prompt: reply,
            retryPrompt: 'Por favor, eliga una opción antes de continuar.',
        });
    }
}

export default CareerCurriculumDialog;
