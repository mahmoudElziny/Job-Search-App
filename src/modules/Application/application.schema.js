import BaseJoi from 'joi';
import JoiDate from '@joi/date';

import { objectIdRule } from "../../utils/general-rules.utils.js";

const Joi = BaseJoi.extend(JoiDate);


// applications For A Specific Company On A Specific Day And Creates An Excel Sheet schema object to valiate data 
export const applicationsForASpecificCompanyOnASpecificDayAndCreatesAnExcelSheetSchema = {
    body: Joi.object({
        companyId: Joi.string().custom(objectIdRule).required(),
        date: Joi.date().format(['YYYY/MM/DD', 'YYYY-MM-DD']).required(),
    }),
}