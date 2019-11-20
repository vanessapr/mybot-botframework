import { WaterfallDialog, TextPrompt, ComponentDialog } from 'botbuilder-dialogs';
import { container } from '../../../inversify.config';
import TYPES from '../../../types';
import ILeadUserUseCase from '../../../use_cases/ILeadUserUseCase';

class RegisterLeadUserDialog extends ComponentDialog {
    private static NAME_PROMPT = 'name_prompt';
    private static EMAIL_PROMPT = 'email_prompt';
    public static PROPERTY_NAME = 'register_lead_user_property';
    public static DIALOG_NAME = 'register_lead_user_dialog';
    public static LEAD_USER_INFO = 'lead_user_info';
    private leadUserUseCase: ILeadUserUseCase;

    constructor(id: string, initialDialogId: string) {
        super(id);

        this.initialDialogId = initialDialogId;
        this.leadUserUseCase = container.get<ILeadUserUseCase>(TYPES.ILeadUserUseCase);

        this.addDialog(new TextPrompt(RegisterLeadUserDialog.NAME_PROMPT))
            .addDialog(new TextPrompt(RegisterLeadUserDialog.EMAIL_PROMPT));

        this.addDialog(new WaterfallDialog(initialDialogId, [
            this.prompForName.bind(this),
            this.prompForEmail.bind(this),
            this.finalStep.bind(this),
        ]));
    }

    public async prompForName(stepContext) {
        stepContext.values[RegisterLeadUserDialog.LEAD_USER_INFO] = {};
        // TODO: validate input
        return await stepContext.prompt(RegisterLeadUserDialog.NAME_PROMPT, {
            prompt: '¿Cuál es tu nombre?',
        });
    }

    public async prompForEmail(stepContext) {
        stepContext.values[RegisterLeadUserDialog.LEAD_USER_INFO].name = stepContext.result;
        // TODO: validate input
        return await stepContext.prompt(RegisterLeadUserDialog.EMAIL_PROMPT, {
            prompt: '¿Cuál es tu correo electrónico?',
            retryPrompt: 'No te olvides de dejarnos tu correo electrónico para más información',
        });
    }

    public async finalStep(stepContext) {
        stepContext.values[RegisterLeadUserDialog.LEAD_USER_INFO].email = stepContext.result;
        const name = stepContext.values[RegisterLeadUserDialog.LEAD_USER_INFO].name;
        const email = stepContext.values[RegisterLeadUserDialog.LEAD_USER_INFO].email;
        // this.leadUserUseCase.saveLeadUser(stepContext.context, name, email);
        return await stepContext.endDialog(`Genial! Le estaremos enviando más información a ${stepContext.result}`);
    }
}

export default RegisterLeadUserDialog;
