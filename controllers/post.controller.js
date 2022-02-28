const errorMiddleware = require('../middlewares/error');
const Joi = require('joi');
const { Post } = require('../models/post.model');

module.exports.findByFeedId = errorMiddleware(async (req, res) => {
    const feedId = req.params.feedId;
    
    const posts = await Post.find({ feedId: feedId }).sort({created_date: -1})
    res.send({
        status:  'sucsess',
        code: 200,
        data: posts});
    
})

module.exports.create = errorMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    
    const post = new Post({
        userId: req.user.id,
        feedId: req.body.feedId,
        message: req.body.message,
        created_date: Date.now(),
        update_date: Date.now()
    })

    // let transporter = nodemailer.createTransport({ 
    //         service: 'Sendgrid', 
    //         auth: { 
    //             user: process.env.SENDGRID_USERNAME || 'jlrabdulazeez@gmail.com', 
    //             pass: process.env.SENDGRID_PASSWORD || 'youaresafeherenow'
    //         } 
    //     });

    //     let mailOptions = { 
    //         from: 'no-reply@joride.com', 
    //         to: 'jlrabdulazeez@gmail.com', 
    //         subject: 'New Delivery', 
    //         text: 'Hello this is a new delivery '
    //     };

    //     transporter.sendMail(mailOptions, function(err) {
    //         if(err) {
    //             return res.status(500)
    //             .send({ message: 'Technical Issue!, Email not sent'});
    //         }
    //         return res.send('Email sent');
    //     })

    await post.save();
    res.send({
        status:  'sucsess',
        code: 200,
        data: post});
})

function validate (post) {
    let schema = Joi.object({
        feedId: Joi.string().min(3).max(50).required(),
        message: Joi.string().min(3).max(500).required()
    });

    return schema.validate(post)
}