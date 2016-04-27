/**
 * Created by Christopher on 4/27/2016.
 */
var express = require('express');
var router = express.Router();
var redis = require('redis');

var redis_url = 'redis://192.168.99.100:6379';
var redisClient = redis.createClient(redis_url);

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

// REST API V3 calls go here.
router.get('/api/v3/entries.json', function(req, res) {
    console.log('Redis get all');
    redisClient.hgetall(redis.print); //{
//        if (err) {
//            throw err;
//        }
//        db.collection('entries').find({},{subject:1}).toArray(function(err, result) {
//            if (err) {
//                throw err;
//            }
//            res.status(200).json(result);
//            db.close();
//        });
//    });
});

// Create
router.post('/api/v3/entries.json', function(req, res){
    // Store new entry and return id.
    console.log(req.body);
    console.log('redis create');
    // {"subject":"Something else","content":"This is the contents for 'Something else'"}
    var newObj = {};
    newObj.subject = req.body.subject;
    newObj.content = req.body.content;

    redisClient.(dbname, function(err, db) {
        if (err) {
            throw err;
        }
        db.collection('entries').insert(newObj, function(err, result) {
            if (err) {
                throw err;
            }
            res.status(201).json(result.ops[0]._id);
            db.close();
        });
    });
});

// Read
router.get('/api/v3/entries/:id.json', function(req, res){
    var id = new mongo.ObjectId(req.params.id);

    mongoClient.connect(dbname, function(err, db) {
        if (err) {
            throw err;
        }
        console.log(`Checking mongodb for _id:${id}`);
        //find({_id:ObjectId("56fab77f6ab3ead947e97973")})
        db.collection('entries').find({_id:id}).toArray(function(err, result) {
            if (err) {
                console.log(`Reading _id ${id} failed: ${err}`);
                throw err;
            }
            console.log(`Reading _id succeeded with result: ${result[0].data}`);
            res.status(201).json(result[0]);
            db.close();
        });
    });
});

// Update
router.put('/api/v3/entries/:id.json', function(req, res){
    var object = {};
    var id = new mongo.ObjectId(req.params.id);
    var subject = req.body.subject;
    var content = req.body.content;

    object._id = id;
    object.subject = subject;
    object.content = content;

    mongoClient.connect(dbname, function(err, db) {
        if (err) {
            throw err;
        }
        db.collection('entries').update({_id:id}, object, function(err, result) {
            if (err) {
                console.log(`Updating _id ${id} failed: ${err}`);
                throw err;
            }
            console.log(`Updating _id succeeded with result: ${result}`);
            res.sendStatus(204);
            db.close();
        });
    });
});

// Delete
router.delete('/api/v3/entries/:id', function(req, res){
    var id = new mongo.ObjectId(req.params.id);

    mongoClient.connect(dbname, function(err, db) {
        if (err) {
            throw err;
        }
        console.log(`Checking mongodb for _id:${id}`);
        //find({_id:ObjectId("56fab77f6ab3ead947e97973")})
        db.collection('entries').remove({_id:id}, function(err, result) {
            if (err) {
                console.log(`Deleting _id ${id} failed: ${err}`);
                throw err;
            }
            console.log(`Deleting _id succeeded with result: ${result.data}`);
            res.sendStatus(204);
            db.close();
        });
    });
});

module.exports = router;
// END REAST API V3 CALLS.
