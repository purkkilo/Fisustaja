const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get Competitions
router.get('/', async (req, res) => {
    const competitions = await loadCompetitionsCollection();
    res.send(await competitions.find({}).toArray());
})

// Add Competition
router.post('/', async (req, res) => {
    const competitions = await loadCompetitionsCollection();
    await competitions.insertOne({
        competition_id: req.body.competition_id,
        competition_name: req.body.competition_name,
        cup_name:  req.body.cup_name,
        cup_points_multiplier: req.body.cup_points_multiplier,
        date_of_competition: req.body.date_of_competition,
        start_of_competition: req.body.start_of_competition,
        end_of_competition: req.body.end_of_competition,
        fishes: req.body.fishes,
        state: "Rekisteröity",
        createdAt: new Date()
    });

    res.status(201).send();
})

// Update one competition
router.put('/:id', async (req, res) => {
    const competitions = await loadCompetitionsCollection();
    var updateSignees = req.body;
    delete updateSignees._id;
    await competitions.updateOne(
        {_id: new mongodb.ObjectID(req.params.id)},
        { "$set":  {"signees" : updateSignees}}
    );
    res.status(204).send();
})


// Delete Competitions
router.delete('/:id', async (req, res) => {
    const competitions = await loadCompetitionsCollection();
    await competitions.deleteOne({_id: new mongodb.ObjectID(req.params.id)});

    res.status(200).send();
})

async function loadCompetitionsCollection() {
    let mongodb_url = "";
    if (process.env.NODE_ENV === "production") {
        mongodb_url = process.env.MONGODB_URI;
    }
    else {
        const config = require('./config.json');
        mongodb_url = config.mongodb_url;
    }

    const client = await mongodb.MongoClient.connect(mongodb_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return client.db('fisustaja').collection('competitions');
}


module.exports = router;