import { Dialog } from 'botbuilder-dialogs';
import { DialogContext, DialogTurnResult } from 'botbuilder-dialogs';
import moment from 'moment-timezone';

class GoodByeDialog extends Dialog {
    public async beginDialog(dc: DialogContext): Promise<DialogTurnResult<any>> {
        const currentDate = moment(new Date());
        const hours = currentDate.tz('America/Santiago').hours();
        const goodbye = hours <= 13 ? '¡Que tengas un buen día!' : '¡Hasta luego!';

        await dc.context.sendActivity('Muchas gracias por tu interés en IACC, ' +
            'te contactaremos a la brevedad.'
            + ` ${goodbye}`);
        return await dc.endDialog();
    }
}

export default GoodByeDialog;
