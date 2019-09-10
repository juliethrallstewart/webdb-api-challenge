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

router.get('/:id', (req, res) => {
    const { id } = req.params;

    db('accounts')
        .where({ id }) 
        .first() 
        .then(account => {
            res.status(200).json(account);
        })
        .catch(err => {
            res.json(err);
        });
});

router.post('/', validate, (req, res) => {
    const postData = req.body;

    db('accounts')
        .insert(postData, 'id')
        .then(([id]) => {
            db('accounts')
                .where({ id }) 
                .first() 
                .then(account => {
                    res.status(200).json(account);
                });
        })
        .catch(err => {
            res.json(err);
        });
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    db('accounts')
        .where('id', req.params.id)
        .update(changes)
        .then(count => {
            res.status(200).json({ message: `updated ${count} record` });
        })
        .catch(err => {
            res.json(err);
        });
});

router.delete('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            res.status(200).json({ message: `deleted ${count} records` });
        })
        .catch(err => {
            res.json(err);
        });
});
module.exports = router;

//middleware 

function validate (req, res, next) {

    const newEntry = req.body

    db('accounts')
        .select('name', 'budget')
        .then(result => {
            console.log(result)
            !result.includes(newEntry.name) && newEntry.budget ? console.log('account validated', next()):
            res.status(404).json({message: 'Please enter a name and budget'})
        })
        .catch(e => {
            res.status(500).json({error: 'error retrieving database'})
        })

}