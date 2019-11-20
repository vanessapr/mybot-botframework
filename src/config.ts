import 'reflect-metadata';
import * as path from 'path';
import { injectable } from 'inversify';
import { BotConfiguration, IEndpointService } from 'botframework-config';
import { config } from 'dotenv';

config();

const BOT_CONFIGURATION = (process.env.NODE_ENV || 'development');
const BOT_FILE = path.resolve(__dirname, '..', (process.env.botFilePath || './iacc-bot.bot'));
const botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);
const endpointConfig = botConfig.findServiceByNameOrId(BOT_CONFIGURATION) as IEndpointService;

export interface IEnvironmentConfig {
    PORT: string;
    MICROSOFT_APP_ID: string;
    MICROSOFT_APP_PWD: string;
    BOT_FILE: string;
    DB_SERVICE_ENDPOINT: string;
    DB_AUTH_KEY: string;
    DB_NAME: string;
    DB_COLLECTION: string;
}

@injectable()
export class Config implements IEnvironmentConfig {
    public PORT = process.env.PORT || '3978';
    public MICROSOFT_APP_ID = endpointConfig.appId || process.env.microsoftAppID || '';
    public MICROSOFT_APP_PWD = endpointConfig.appPassword || process.env.microsoftAppPassword || '';
    public BOT_FILE = BOT_FILE;
    public DB_SERVICE_ENDPOINT = process.env.DB_SERVICE_ENDPOINT || '';
    public DB_AUTH_KEY = process.env.DB_AUTH_KEY || '';
    public DB_NAME = process.env.DB_NAME || '';
    public DB_COLLECTION = process.env.DB_COLLECTION || '';
}
