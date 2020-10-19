import express from "express";
import { connect, connection } from "mongoose";
import { mongoURI } from "../config/keys";
import passport from "passport";
import users from "../src/api/users";
import bodyParser from 'body-parser'

const db = require("../config/keys").mongoURI;
const app = express();

app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(bodyParser.json());

connect(db, {
	// useCreationIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

connection.once("open", () => {
	console.log("DB connected");
	console.log(mongoURI);
});

// app.use(express.json());

app.use(passport.initialize());

app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`listening at https://localhost:${port}`);
});
