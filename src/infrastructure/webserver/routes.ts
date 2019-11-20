import WelcomeController from '../../controllers/WelcomeController';
import MessagesController from '../../controllers/MessagesController';

const messageController = new MessagesController();

const configureRoutes = (app) => {
    app.get('/welcome', WelcomeController.sayHello);
    app.post('/api/messages', messageController.processMessages);
};

export default configureRoutes;
