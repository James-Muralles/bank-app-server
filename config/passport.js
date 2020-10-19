import JwtStrategy from "passport-jwt"
import ExtractJwt from 'passport-jwt';
import mongoose from 'mongoose';

const User = model("users");
import keys from '../config/keys';
import passport from "passport";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

const passports = () =>{
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) =>{
            User.findById(jwt_payload.id)
            .then(user =>{
                if (user){
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
        })
    );
};
