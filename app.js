const cors = require('cors');
const config = require('config');
const post = require('./routes/post.routes');
const user = require('./routes/user.routes');
const express = require('express');
const app = express();

var corsOption = {
    origin: []
};

app.use(cors(corsOption));

app.use(express.json());

if(!config.get('jwtPrivateKey')) {
    console.log('Fatal Error jwt token ');
    process.exit(1)
}

require('./db/connection')();

app.use('/api/post', post);
app.use('/api/user', user);
require('./middlewares/prod')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { 
    console.log(`Listening on port ${PORT}`);
})