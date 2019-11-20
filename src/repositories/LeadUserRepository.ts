import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { UserState, StatePropertyAccessor, TurnContext } from 'botbuilder';
import LeadUser from '../entities/LeadUser';
import ILeadUserRepository from './ILeadUserRepository';
import TYPES from '../types';
import { IDatabase } from './configuration';

interface ILeadUser {
    name?: string;
    email?: string;
    username?: string;
    career?: string;
}

@injectable()
class LeadUserRepository implements ILeadUserRepository {
    private static LEAD_USER_INFO_PROPERTY = 'lead_user_info';
    private userState: UserState;
    private userLeadProperty: StatePropertyAccessor<ILeadUser>;

    constructor(@inject(TYPES.IDatabase) db: IDatabase) {
        this.userLeadProperty = db.userState.createProperty<ILeadUser>(LeadUserRepository.LEAD_USER_INFO_PROPERTY);
        this.userState = db.userState;
    }

    public async save(context: TurnContext, user: LeadUser) {
        try {
            const data: ILeadUser = {
                career: user.career,
                email: user.email,
                name: user.name,
                username: user.username,
            };

            await this.userLeadProperty.set(context, data);
            await this.userState.saveChanges(context);
            return true;
        } catch (err) {
            throw new TypeError(`LeadUserRepository: ${err.message}`);
        }
    }

    public async get(context: TurnContext): Promise<LeadUser> {
        const userFromContext = await this.userLeadProperty.get(context, {});
        return new LeadUser(userFromContext.name, userFromContext.email,
            userFromContext.username, userFromContext.career);
    }
}

export default LeadUserRepository;
