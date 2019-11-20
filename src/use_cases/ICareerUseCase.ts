import { TurnContext } from 'botbuilder';

interface ICareerUseCase {
    retrieveCareerName(context: TurnContext): Promise<string>;
}

export default ICareerUseCase;
