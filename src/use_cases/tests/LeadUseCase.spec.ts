import 'mocha';
import { expect } from 'chai';
import { TurnContext } from 'botbuilder';
import sinon from 'sinon';
import LeadUseCase from '../LeadUserUseCase';
import LuisIAService from '../../services/LuisIAService';
import LeadUserRepository from '../../repositories/LeadUserRepository';
import LeadUser from '../../entities/LeadUser';

describe('Use Case: Lead User', () => {
    it('Should return true when a valid LEAD is saved', async () => {
        const name = 'Luis';
        const email = 'luis@mail.com';

        const mockLeadUserRepository = sinon.createStubInstance(LeadUserRepository);
        mockLeadUserRepository.save.resolves(true);
        const leadUserRepository = mockLeadUserRepository as any as LeadUserRepository;

        const luisIAService = sinon.mock(LuisIAService) as any as LuisIAService;
        const context = sinon.mock(TurnContext) as any as TurnContext;
        const leadUseCase = new LeadUseCase(leadUserRepository, luisIAService);
        const user = new LeadUser(name, email);
        const isSaved = await leadUseCase.saveLeadUser(context, user);
        expect(true).to.equal(mockLeadUserRepository.save.calledOnce);
        expect(true).to.equal(isSaved);
    });

    it('Should save an career for an user');

});
