import express from 'express';

import { connectionDB } from "./DB/connection.js";
import { globalResponse } from './src/middlewares/error-handler.middleware.js';
import userRouter from './src/modules/User/user.routes.js'



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

//global responce error handler middleware
app.use(globalResponse);

process.on('unhandledRejection', (err)=> {
    console.log('error', err);
});

app.listen(port, () => console.log(`App listening on port ${port}`));


