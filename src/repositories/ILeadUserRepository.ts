import { TurnContext } from 'botbuilder';
import LeadUser from '../entities/LeadUser';

interface ILeadUserRepository {
    save(context: TurnContext, leadUser: LeadUser): Promise<boolean>;
    get(context: TurnContext): Promise<LeadUser>;
}

export default ILeadUserRepository;
