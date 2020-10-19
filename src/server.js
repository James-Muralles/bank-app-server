import express from "express";
import {connect, connection} from 'mongoose';
import { mongoURI } from "../config/keys";
const db = require("../config/keys").mongoURI;
const app = express();

connect(db,{
    // useCreationIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

connection.once('open', ()=>{
    console.log('DB connected')
    console.log(mongoURI)
})

app.use(express.json());

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`listening at https://localhost:${port}`);
});