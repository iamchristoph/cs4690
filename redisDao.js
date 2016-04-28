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
    console.log('Redis getting all items');
    var repl = [];
    redisClient.smembers('siq', function (err, replies) {
        if (replies.length > 0) {
            replies.forEach(function (reply, i) {
                redisClient.hmget(reply, '_id', 'subject', function(err, rep) {
                    if(err)
                        console.log(err);
                    else {
                        var object = {};
                        object._id = rep[0];
                        object.subject = rep[1];
                        repl.push(object);
                    }
                    if (i == replies.length-1) {
                        console.log('got ' + replies.length + ' items');
                        res.json(repl);
                    }
                })
            });
        } else {
            console.log('there are no keys');
            res.json(repl);
        }
    });
});


// Create
router.post('/api/v3/entries.json', function(req, res) {
    // Store new entry and return id.
    console.log('redis create '+ req.body);
    redisClient.incr('id', function (err, id) {
        if (err) {
            console.log(err);
            res.status(404);
        } else {
            console.log('id = ' + id);
            redisClient.sadd('siq', 'entries:' + id, redis.print);
            redisClient.hmset('entries:' + id, '_id', id, 'subject', req.body.subject, 'content', req.body.content, redis.print);
            res.status(201).json(id);
        }
    });
});


// Read
router.get('/api/v3/entries/:id.json', function(req, res){
    var id = req.params.id;
    redisClient.hgetall('entries:'+ id, function(err, rep) {
        if (err) {
            console.log(err);
            res.status(404);
        } else {
            console.log(rep);
            res.status(201).json(rep);
        }
    });
});

// Update
router.put('/api/v3/entries/:id.json', function(req, res){
    // Store new entry and return id.
    console.log('redis update '+ req.body.subject + ' ' + req.body.content);
    var id = req.params.id;
    redisClient.hmset('entries:' + id, '_id', id, 'subject', req.body.subject, 'content', req.body.content, function(err, rep) {
        if (err) {
            console.log(err);
            res.status(404);
        } else {
            console.log('updated id = ' + id);
            res.status(201);
        }
    });
});

// Delete
router.delete('/api/v3/entries/:id', function(req, res){
    var id = req.params.id;
    console.log(`attempting to remove ${id}`);
    redisClient.srem('siq', 'entries:'+id, function(er, re) {
        console.log('removed ' + re);
        redisClient.del('entries:' + id, function(err, r) {
            console.log(`Deleted ${r} items`);
            res.sendStatus(204);
        })
    });
});

module.exports = router;
// END REAST API V3 CALLS.
