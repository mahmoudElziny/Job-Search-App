import express from 'express';

import { connectionDB } from "./DB/connection.js";
import { globalResponse } from './src/middlewares/error-handler.middleware.js';
import userRouter from './src/modules/User/user.routes.js';
import companyRouter from './src/modules/Company/company.routes.js'



//instance of express module
const app = express();

//port number 
const port = 3000;

//database connection
connectionDB();

//middleware function to parse incoming JSON data from HTTP requests
app.use(express.json());

//user router 
app.use("/user", userRouter);
//company router 
app.use("/company", companyRouter);

//global responce error handler middleware
app.use(globalResponse);

//handle any error or any rejections in the code
process.on('unhandledRejection', (err)=> {
    console.log('error', err);
});

app.listen(port, () => console.log(`App listening on port ${port}`));


