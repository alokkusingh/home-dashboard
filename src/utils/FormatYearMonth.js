import { parseISO, format } from 'date-fns';

export const formatYearMonth = (year, month) => {
     if(month < 10)
         return format(parseISO(year + "0" + month), 'MMM yyyy');

     return format(parseISO(year + "" + month), 'MMM yyyy');
};
