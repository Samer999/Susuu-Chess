const jwt = require('jsonwebtoken');
const User = require('../models/User');

const maxAge = 3 * 24 * 60 * 60;

const handleErrors = (err) => {
    let errors = {email: '', password: ''};
    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'that email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'that password is not correct';
    }



    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
    }

    return errors;
}


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRETE_KEY, {expiresIn: maxAge});
}

module.exports.sign_in_get = (req, res) =>{
    res.render('sign-in');
}

module.exports.sign_up_get = (req, res) =>{
    res.render('sign-up');
}

module.exports.sign_in_post = async (req, res) =>{
    const {email, password} = req.body;

    try {
        const user = await User.signIn(email, password);
        const token = createToken(user._id);
        console.log(token);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(405).json({errors});
    }
}

module.exports.sign_up_post = async (req, res) =>{
    let {email, password, name} = req.body;
    email = email.toLowerCase();
    name = name.toLowerCase();

    try {
        const user = await User.create({email, password, name});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.sign_out = (req, res) =>{
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

