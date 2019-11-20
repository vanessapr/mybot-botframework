import * as restify from 'restify';
import configureRoutes from './routes';

export const createServer = () => {
    // Create HTTP server.
    const server = restify.createServer();

    configureRoutes(server);

    return server;
};
