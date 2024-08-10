import express from 'express';
import { config } from 'dotenv';

import { connectionDB } from "./DB/connection.js";
import { globalResponse } from './src/middlewares/error-handler.middleware.js';
import userRouter from './src/modules/User/user.routes.js';
import companyRouter from './src/modules/Company/company.routes.js';
import jobRouter from './src/modules/Job/job.routes.js';
import applicationRouter from './src/modules/Application/application.routes.js';


//env file 
config();

//instance of express module
const app = express();

//port number 
const port = +process.env.PORT;

//database connection
connectionDB();

//middleware function to parse incoming JSON data from HTTP requests
app.use(express.json());

//user router 
app.use("/user", userRouter);
//company router 
app.use("/company", companyRouter);
//job router 
app.use("/job", jobRouter);
//application router 
app.use("/application", applicationRouter);

//global responce error handler middleware
app.use(globalResponse);

//handle any error or any rejections in the code
process.on('unhandledRejection', (err)=> {
    console.log('error', err);
});

app.listen(port, () => console.log(`App listening on port ${port}`));


