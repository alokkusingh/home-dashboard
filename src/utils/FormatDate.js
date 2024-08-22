import { parseISO, format } from 'date-fns';

export const formatDate = (dateTime, fmt='dd MM yyyy') => {

     return format(parseISO(dateTime), fmt);
};
