import { parseISO, format } from 'date-fns';

export const formatYearMonth = (year, month, fmt='MMM yyyy') => {
     if(month < 10)
         return format(parseISO(year + "0" + month), fmt);

     return format(parseISO(year + "" + month), fmt);
};
