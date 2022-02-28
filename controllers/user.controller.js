const { User, Token } = require('../models/user.model');
const errorMiddleWare = require('../middlewares/error');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const _ = require('lodash')

exports.signup = errorMiddleWare( async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send({message: error.details[0].message});
    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).send({message: 'User already available with that email'});

    user = new User(
        _.pick(req.body, ['firstname', 'lastname', 'email', 'interests', 'password'])
        );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    let token = new Token({
        userId: user.id, 
        token: crypto.randomBytes(16).toString('hex')
    })

    token.save(async function(err) {
        if(err) {
            console.log(err.message)
            return res.status(500).send({message: err.message})
        }

        // const msg = {
        //     from: 'pelumifadolapo7@gmail.com', 
        //     to: user.email, 
        //     subject: 'Account Verification Link', 
        //     text: 'Hello '+ user.firstname + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 'www.thehedgehog.xyz' + '\/confirm\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
        // };
          //ES6
        // sgMail
        //     .send(msg)
        //     .then(async () => {
        //         await user.save();
        //         res.send({message: 'A verification email has been sent to ' + user.userEmail + '. It will expire after one day'});
        //     }, error => {
        //       console.error(error.response.body);
          
        //       return res.status(500)
        //         .send({ message: 'Technical Issue!,'});
        //     });
        
    })
    await user.save();
    res.send({
        status:  'sucsess',
        code: 200,
        data: _.pick(user, ['firstname', 'lastname', 'email', 'interests'])});
    });

exports.login = errorMiddleWare( async (req, res) => {
    const { error } = validateLogin(req.body);
    if(error) return res.status(400).send({message: error.details[0].message});

    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send({message: 'Invalid Email or Password'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if(!validPassword) return res.status(400).send({ message: "Invalid email or password" });

    if(!user.isVerified){
        return res.status(401).send({ message: 'Your email as not been verified'})
    }

    const token = user.generateToken();
    res.set('x-auth-token', token)
	res.set('Access-Control-Expose-Headers', 'x-auth-token')
    user.token = token
    return res.send({
        status:  'sucsess',
        code: 200,
        data: _.pick(user, ['firstname', 'lastname', 'email', 'interests', 'token'])});
    
});

module.exports.findAll = errorMiddleWare(async (req, res) => {
 
    const users = await User.find({isVerified: true})
    res.send(users);
    
})

module.exports.findByUserId = errorMiddleWare(async (req, res) => {
    let id = req.user.id
    const users = await User.findById(id)
    res.send({
        status:  'sucsess',
        code: 200,
        data: _.pick(users, ['firstname', 'lastname', 'email', 'interests', 'token'])});
    
})


exports.passwordVerify = errorMiddleWare( async (req, res) => {
    let token = await Token.findOne({token: req.params.token})
    if(!token) return res.status(400).send({message: 'Your token might have expired resend token'});

    const user = await User.findOne({email: req.params.email });
    if(!user) return res.status(400).send({ message: "'We are unable to find a user with that email please signup" });

    res.send({message: 'Valid'})    
});

exports.resetPassword = errorMiddleWare( async (req, res) => {
    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send({message: 'User not available with that email'});

    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(req.body.password, salt);
    await User.findOneAndUpdate({email: req.body.email}, {password: password})

    await Token.findOneAndDelete({token: req.body.token})

    res.send({message: 'successful'});
});

function validate(user){
    const schema = Joi.object({
        firstname: Joi.string().min(3).max(50).required(),
        lastname: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().min(3).max(255).required(),
        interests: Joi.array().min(1).max(50).required(),
        password: Joi.string().min(8).max(1024).required(),
        // userAddress: Joi.string().min(10).max(1024),
        // userPhoneNo: Joi.string().min(7).max(15)
    })

    return schema.validate(user);
}

function validateLogin(user){
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(255).required(),
        password: Joi.string().min(8).max(1024).required()
    })

    return schema.validate(user);
}