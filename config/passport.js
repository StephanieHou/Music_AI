const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const musersModel = mongoose.model("Musers");
const keys = require("./keys");
const opts = {};

opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new jwtStrategy(opts, (payload, done) => {
            musersModel.findById(payload.id)
                .then(muser => {
                    if (muser) {
                        return done(null, muser);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};