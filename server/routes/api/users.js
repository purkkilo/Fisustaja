const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const router = express.Router();
let mongodb_url = "";
let secret = "";

if (process.env.NODE_ENV === "production") {
    mongodb_url = process.env.MONGODB_URI;
    secret = process.env.SECRET;
}
else {
    const config = require('./config.json');
    mongodb_url = config.mongodb_url;
    secret = config.secret;
}

// Get users
router.get('/', async (req, res) => {
    const users = await loadUsersCollection();
    res.send(await users.find({}).toArray());
})

// Get user
router.get('/:email', async (req, res) => {
    const users = await loadUsersCollection();
    res.send(await users.find({email: req.params.email}).toArray());
})

// REGISTER ROUTES
router.post('/register', async (req, res) => {
    const users = await loadUsersCollection();
    await users.insertOne({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        createdAt: new Date()
    },
    async function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.");
        await users.findOne({email: req.body.email}, (err, user) => {
            if(err) return res.status(500).send("There was a problem getting user");
            let token = jwt.sign({ id: user.id }, secret, {expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token, user: user });
        })
    });
});

router.post('/register-admin', async (req, res) => {
    const users = await loadUsersCollection();
    await users.insertOne({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        is_admin: true,
        createdAt: new Date()
    },
    async function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.");
        await users.findOne({email: req.body.email}, (err, user) => {
            if(err) return res.status(500).send("There was a problem getting user");
            let token = jwt.sign({ id: user.id }, secret);
            res.status(200).send({ auth: true, token: token, user: user });
        })
    });
});

// Login ROUTES
router.post('/login', async (req, res) => {
    const users = await loadUsersCollection();
    await users.findOne({email: req.body.email}, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: user.id }, secret, {expiresIn: 10 // expires in 24 hours
        });
        res.header('auth-token', token);
        res.status(200).send({ auth: true, token: token, user: user });
    })
});

router.post('/auth', async (req, res) => {
    const token = req.body.token;
    if(!token) return res.status(401).send('No token!');

    try {
        // Check token, if expired throws an error
        const verified = jwt.verify(token, secret);
        req.user = verified;
    }catch (err) {
        //TokenExpiredError
        if(err.message === 'jwt expired')  {
            res.status(400).send('Expired Token');
        }
        //All other errors?
        else {
            res.status(400).send('Invalid Token');
        }
    }
    
});

async function loadUsersCollection() {
    const client = await mongodb.MongoClient.connect(mongodb_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return client.db('fisustaja').collection('users');
}

module.exports = router;