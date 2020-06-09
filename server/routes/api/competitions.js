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
        cup_placement_points: req.body.cup_placement_points,
        cup_participation_points: req.body.cup_participation_points,
        cup_points_multiplier: req.body.cup_points_multiplier,
        date_of_competition: req.body.date_of_competition,
        competition_duration: req.body.competition_duration,
        start_of_competition: req.body.start_of_competition,
        end_of_competition: req.body.end_of_competition,
        total_weights: req.body.total_weights,
        signees: req.body.signees,
        fishes: req.body.fishes,
        state: req.body.state,
        createdAt: new Date()
    });

    res.status(201).send();
})

// Update one competition
router.put('/:id', async (req, res) => {
    const competitions = await loadCompetitionsCollection();
    const competition = req.body;
    delete competition._id
    await competitions.replaceOne(
        {_id: new mongodb.ObjectID(req.params.id)},
        competition
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