import { createServer } from './infrastructure/webserver/server';

const server = createServer();

server.listen(process.env.PORT || 3978, () => {
    console.info(`\n${server.name} listening to ${server.url}`);
    console.info(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.info(`\nTo talk to your bot, open chat-bot.bot file in the Emulator.`);
});
