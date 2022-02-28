const cors = require('cors');
const config = require('config');
const post = require('./routes/post.routes');
const user = require('./routes/user.routes');
const express = require('express');
var path = require('path');
const app = express();
var indexRouter = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var logger = require('morgan');

var corsOption = {
    origin: []
};

app.use(cors(corsOption));

app.use(express.json());
app.use(logger('dev'));

if(!config.get('jwtPrivateKey')) {
    console.log('Fatal Error jwt token ');
    process.exit(1)
}

require('./db/connection')();

app.use('/', indexRouter);
app.use('/api/post', post);
app.use('/api/user', user);
require('./middlewares/prod')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
    console.log(`Listening on port ${PORT}`);
})