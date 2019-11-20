import { v1 } from 'uuid';

export const generateId = (prefix = '') => {
    return `${prefix}_ ${v1()}`;
};
