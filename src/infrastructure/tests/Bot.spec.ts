import 'mocha';
import moment from 'moment-timezone';
import { TestAdapter } from 'botbuilder';
import { expect } from 'chai';
import { container } from '../../inversify.config';
import TYPES from '../../types';
import IBot from '../../infrastructure/bot/IBot';

describe('Bot', () => {
    let adapter: TestAdapter;

    beforeEach(() => {
        const bot = container.get<IBot>(TYPES.IBot);
        adapter = new TestAdapter(bot.onTurn);
    });

    it('The bot should says "Hola, ¿en qué te puedo ayudar?" when the user says "hola"', (done) => {
        adapter.send('hola')
            .assertReply('Hola, ¿en qué te puedo ayudar?')
            .then(done)
            .catch(done);
    });

    it('The bot should says "¡Hola Alvaro! ¿en qué puedo ayudarte?" when the user says "hola soy alvaro"', (done) => {
        adapter.send('hola soy alvaro')
            .assertReply('¡Hola Alvaro! ¿en qué puedo ayudarte?')
            .then(done)
            .catch(done);
    });

    it.skip('the bot should answer to FAQ made by the user', (done) => {
        adapter.send('el titulo tiene validez')
            .assertReply('Sí, el título es igual al que entrega una carrera similar presencial,' +
                ' por tanto es igualmente válido.')
            .send('IACC es autonomo')
            // .assertReplyOneOf(['Sí, Instituto Profesional IACC tiene plena autonomía desde el 1 ' +
            //  'de marzo de 2006, lo que está respaldado por el Decreto Exento 226, registro D número 23 de MINEDUC.'])
            .assertReply((reply) => {
                expect(reply.text).to.include('Sí, Instituto Profesional IACC tiene plena autonomía');
            })
            .then(done)
            .catch(done);
    });

    it.skip(`The bot should says "Muchas gracias ¿cuál es la carrera o diplomado que te interesa?"
        when the user writes his email`, (done) => {
        adapter.send('alvaro@tars.technology')
            .assertReply('Muchas gracias ¿cuál es la carrera o diplomado que te interesa?')
            .then(done)
            .catch(done);
    });

    it.skip(`The bot should says "¡Muchas gracias Luis!"
        when the user writes his email`, (done) => {
        adapter.send('Soy luis')
            .assertReply('¡Hola Luis! ¿en qué puedo ayudarte?')
            .send('alvaro@tars.technology')
            .assertReply('¡Muchas gracias Luis!')
            .then(done)
            .catch(done);
    });

    it(`The bot should passed the script #1`, (done) => {
        const currentDate = moment(new Date());
        const hours = currentDate.tz('America/Santiago').hours();
        const goodbye = hours <= 13 ? '¡Que tengas un buen día!' : '¡Hasta luego!';

        adapter.send('Soy luis')
            .assertReply('¡Hola Luis! ¿en qué puedo ayudarte?')
            .send('alvaro@tars.technology')
            .assertReply('¡Muchas gracias Luis!')
            .assertReply('¿Cuál es la carrera o diplomado que te interesa?')
            .send('diplomado en liderazgo')
            .assertReply('Perfecto, un ejecutivo te enviará información sobre Diplomado en Liderazgo Organizacional'
                + ' y Trabajo en Equipo. ¿Te gustaría saber algo más? (1) Si or (2) No')
            .send('no')
            .assertReply('Muchas gracias por tu interés en IACC, te contactaremos a la brevedad.'
                + ` ${goodbye}`)
            .then(done)
            .catch(done);
    });

    it.only(`The bot should passed the script #2`, (done) => {
        adapter.send('¿cual es la duración del programa de contabilidad?')
            .assertReply('La duración es de 2 años.')
            .send('¿cual es la malla curricular?')
            .assertReply('Para ver la malla curricular, escribe tu email y te enviaré la información.')
            .send('alvaro@tars.tecnology')
            // .assertReply('Muchas gracias, ¿tienes otra consulta?')
            .then(done)
            .catch(done);
    });
});
