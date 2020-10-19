import express from "express";
import Router from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const key = require("../../config/keys").secretOrKey;


import validateRegisterInput from "../validation/register";
import validateLoginInput from "../validation/login";

import User from "../models/User";

const router = Router();

router.post("/register", (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			return res.status(400).json({ email: "Email already exists" });
		} else {
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (error, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => res.json(user))
						.catch((err) => console.log(err));
				});
			});
		}
	});

	
	router.post("/login", (req, res) => {
		// Form validation
		const { errors, isValid } = validateLoginInput(req.body);
		// Check validation
		if (!isValid) {
			return res.status(400).json(errors);
		}
		const email = req.body.email;
		const password = req.body.password;
		// Find user by email
		User.findOne({ email }).then((user) => {
			// Check if user exists
			if (!user) {
				return res.status(404).json({ emailnotfound: "Email not found" });
			}
			// Check password
			bcrypt.compare(password, user.password).then((isMatch) => {
				if (isMatch) {
					// User matched
					// Create JWT Payload
					const payload = {
						id: user.id,
						name: user.name,
					};
					// Sign token
					jwt.sign(
						payload,
						key.secretOrKey,
						{
							expiresIn: 31556926, // 1 year in seconds
						},
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				} else {
					return res
						.status(400)
						.json({ passwordincorrect: "Password incorrect" });
				}
			});
		});
	});
});
export default router;
