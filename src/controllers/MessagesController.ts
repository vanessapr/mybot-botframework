import { container } from '../inversify.config';
import TYPES from '../types';
import IMessageUseCase from '../use_cases/IMessageUseCase';

class MessagesController {
    private messageUseCase: IMessageUseCase;

    constructor() {
        this.messageUseCase = container.get<IMessageUseCase>(TYPES.IMessageUseCase);
    }

    public processMessages = (request, response) => {
        this.messageUseCase.processMessage(request, response);
    }
}

export default MessagesController;
