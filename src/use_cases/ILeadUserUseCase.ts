import { TurnContext, RecognizerResult } from 'botbuilder';
import LeadUser from '../entities/LeadUser';

interface ILeadUserUseCase {
    updateUsername(turnContext: TurnContext, recognizeResult: RecognizerResult): void;
    getLeadUser(context: TurnContext): Promise<LeadUser>;
    saveLeadUser(context: TurnContext, leadUser: LeadUser): Promise<boolean>;
    saveCareerForUser(context: TurnContext, career: string): Promise<boolean>;
}

export default ILeadUserUseCase;
