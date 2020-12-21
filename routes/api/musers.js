const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const validateRegister = require("../../validation/register");
const validateLogin = require("../../validation/login");

const musersModel = require('../../model/Musers');


//Validation

router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegister(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    musersModel.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email Already Exists" });
        } else {
            const newMuser = new musersModel({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newMuser.password, salt, (err, hash) => {
                    if (err) {
                        throw err
                    };

                    newMuser.password = hash;
                    newMuser
                        .save()
                        .then(muser => res.json(muser))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

router.post("/login", (req, res) => {
    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    musersModel.findOne({ email }).then(muser => {
        if (!muser) {
            return res.status(404).json({ notfound: "Could Not Find Email" });
        }

        // LOOK FOR SECURE COMPARSION - ATTACK VECTOR 
        bcrypt.compare(password, muser.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: muser.id,
                    first_name: muser.first_name,
                    last_name: muser.last_name
                };

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ incorrectpwd: "Password Is Incorrect" });
            }
        });
    });
});


//Routes

router.route('/').get(function (req, res) {
    musersModel.find(function (err, musers) {
        if (err) {
            console.log(err);
        } else {
            res.json(musers);
        }
    });
});

router.route('/:id').get(function (req, res) {
    let id = req.params.id;
    musersModel.findById(id, function (err, muser) {
        res.json(muser);
    });
});

router.route('/update/:id').post(function (req, res) {
    musersModel.findById(req.params.id, function (err, muser) {
        if (!muser) {
            res.status(404).send("No Data Found");
        }
        else {
            muser.first_name = req.body.first_name;
            muser.last_name = req.body.last_name;
            muser.password = req.body.password;

            muser.save().then(muser => {
                res.json('Muser Has Been Updated');
            }).catch(err => {
                res.status(400).send("Could Not Update");
            });
        }
    });
});

router.route('/add').post(function (req, res) {
    let muser = new musersModel(req.body);
    muser.save()
        .then(muser => {
            res.status(200).json({ 'muser': 'New Muser Added' });
        })
        .catch(err => {
            res.status(400).send('Could Not Add New Muser');
        });
});

module.exports = router;
