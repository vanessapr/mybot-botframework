import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { TurnContext, ResourceResponse } from 'botbuilder';
import QnAMakerService from '../QnAMakerService';
import { Config } from '../../config';

describe('Service: QnAMaker', () => {
    it('Should return true when to the service is connected and it is defined inside the iacc-bot.bot file', () => {
        const environmentConfig = sinon.createStubInstance(Config);
        environmentConfig.BOT_FILE = './iacc-bot.bot';
        const qnaMakerService = new QnAMakerService(environmentConfig);
        const isConnected = qnaMakerService.connect('faq-qna');
        expect(isConnected).to.equal(true);
    });

    it(`Should throw an exception when trying to connect to an service that is not defined
        in the iacc-bot.bot file`, () => {
        const environmentConfig = sinon.createStubInstance(Config);
        environmentConfig.BOT_FILE = './iacc-bot.bot';
        const qnaMakerService = new QnAMakerService(environmentConfig);
        expect(qnaMakerService.connect).to.throw();
        expect(() => qnaMakerService.connect('faq-qna2'))
            .to.throw(TypeError, 'QnAMaker: config');
    });

    describe('Get Answers', () => {
        let qnaMakerService: QnAMakerService;

        before(() => {
            const environmentConfig = sinon.createStubInstance(Config);
            environmentConfig.BOT_FILE = './iacc-bot.bot';
            qnaMakerService = new QnAMakerService(environmentConfig);
            qnaMakerService.connect('faq-qna');
        });

        it('Should return an answer when the question is the defined in the kb', async () => {
            const mockContext = sinon.createStubInstance(TurnContext, {
                sendActivity: sinon.fake.resolves({ activity: 'ao'}) as any,
            }) as any as TurnContext;
            await mockContext.sendActivity('el titulo tiene validez?');
            // console.log('moccon', mockContext.sendActivity('aa'));
            // mockContext.updateActivity({
            //     type: 'message', text: 'el titulo tiene validez?',
            // });
            // mockContext.activity = sinon.stub().returnsThis() as any as Activity;
            // mockContext.activity.text = 'el titulo tiene validez?';
            const reply = await qnaMakerService.getAnswers(mockContext);
        });
    });
});
