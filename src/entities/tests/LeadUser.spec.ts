import 'mocha';
import { expect } from 'chai';
import LeadUser from '../LeadUser';

describe('Entity: Lead User', () => {
    it('Should create an new LEAD with an name and email', () => {
        const lead = new LeadUser('Luis', 'luis@mail.com');
        expect(lead.name).to.equal('Luis');
        expect(lead.email).to.equal('luis@mail.com');
    });

    it('Should save the username as "Luis" instead of "luis"', () => {
        const username = 'luis';
        const leadUser = new LeadUser();
        leadUser.username = username;
        expect(leadUser.username).to.equal('Luis');
    });
});
