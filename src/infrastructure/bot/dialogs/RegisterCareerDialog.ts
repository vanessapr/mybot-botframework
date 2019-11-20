import { ComponentDialog, TextPrompt, ChoicePrompt, WaterfallDialog } from 'botbuilder-dialogs';
import { container } from '../../../inversify.config';
import TYPES from '../../../types';
import ILeadUserUseCase from '../../../use_cases/ILeadUserUseCase';
import ICareerUseCase from '../../../use_cases/ICareerUseCase';

class RegisterCareerDialog extends ComponentDialog {
    private static CAREER_PROMPT = 'career_prompt';
    private static CHOICE_PROMPT = 'choice_prompt';
    public static PROPERTY_NAME = 'register_career_property';
    private leadUserUseCase: ILeadUserUseCase;
    private careerUseCase: ICareerUseCase;

    constructor(id: string, initialDialogId: string) {
        super(id);
        this.initialDialogId = initialDialogId;
        this.leadUserUseCase = container.get<ILeadUserUseCase>(TYPES.ILeadUserUseCase);
        this.careerUseCase = container.get<ICareerUseCase>(TYPES.ICareerUseCase);

        this.addDialog(new TextPrompt(RegisterCareerDialog.CAREER_PROMPT, this.careerValidator.bind(this)))
            .addDialog(new ChoicePrompt(RegisterCareerDialog.CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(initialDialogId, [
            this.prompForName.bind(this),
            this.saveCareer.bind(this),
        ]));
    }

    private async careerValidator(promptContext) {
        if (!promptContext.recognized.succeeded || !/^[a-zA-Z]+/.test(promptContext.recognized.value)) {
            await promptContext.context.sendActivity('Lo siento, no puedo entenderlo.');
            await promptContext.context.sendActivity(promptContext.options.retryPrompt);
            return false;
        }

        const careerName = await this.careerUseCase.retrieveCareerName(promptContext.context);

        if (!careerName) {
            await promptContext.context.sendActivity(`No fui capaz de encontrar ${promptContext.recognized.value} `
                + 'en nuestra base de datos. Por favor, ingrese el nombre correcto.');
            return false;
        }

        promptContext.recognized.value = careerName;
        return true;
    }

    public async prompForName(stepContext) {
        return await stepContext.prompt(RegisterCareerDialog.CAREER_PROMPT, {
            prompt: '¿Cuál es la carrera o diplomado que te interesa?',
            retryPrompt: 'Debo insistir. ¿Cuál es la carrera o diplomado que te interesa?',
        });
    }

    public async saveCareer(stepContext) {
        const careerName = stepContext.result;
        await this.leadUserUseCase.saveCareerForUser(stepContext.context, careerName);

        if (stepContext.options && stepContext.options.displayMessage) {
            const reply = `Perfecto, un ejecutivo te enviará información sobre ${careerName}.` +
                ' ¿Te gustaría saber algo más?';

            return await stepContext.prompt(RegisterCareerDialog.CHOICE_PROMPT, {
                choices: ['Si', 'No'],
                prompt: reply,
                retryPrompt: 'Por favor, eliga una opción antes de continuar.',
            });
        }

        return await stepContext.endDialog();
    }
}

export default RegisterCareerDialog;
