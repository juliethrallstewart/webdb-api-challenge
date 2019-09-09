const express = require('express');

const db = require('../data/dbConfig');

const router = express.Router()

router.get('/', (req, res) => {
    db('accounts')
        .select('id', 'name', 'budget')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(e => {
            res.status(500).json({error: 'error retrieving accounts from database'})
        })
})

module.exports = router;