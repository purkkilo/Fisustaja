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
        name: req.body.name,
        cup_name:  req.body.cup_name,
        cup_placement_points: req.body.cup_placement_points,
        cup_participation_points: req.body.cup_participation_points,
        cup_points_multiplier: req.body.cup_points_multiplier,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        total_weights: req.body.total_weights,
        signees: req.body.signees,
        fishes: req.body.fishes,
        state: req.body.state,
        teams: req.body.teams,
        team_competition: req.body.team_competition,
        results: req.body.results,
        biggest_fishes:  req.body.biggest_fishes,
        biggest_amounts:  req.body.biggest_amounts,
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