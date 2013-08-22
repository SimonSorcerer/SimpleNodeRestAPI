var express = require('express');

// initialize express
var app = express();

// middleware
app.use(express.bodyParser());

// connect to MongoDB server/database
var db = require('mongoskin').db('localhost:27017/test', {safe:true});


// collection name parameter specification - sets collection
app.param('collectionName', function(req, res, next, collectionName){
    req.collection = db.collection(collectionName);
    return next();
});


// root route
app.get('/', function(req, res) {
    res.send('please select a collection, e.g., /collections/messages');
});


// get all items
app.get('/collections/:collectionName', function(req, res) {
    req.collection.find({}, {limit:10, sort: [['_id',-1]]}).toArray(function(err, results){
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});


// add new item(s)
app.post('/collections/:collectionName', function(req, res) {
    req.collection.insert(req.body, {}, function(err, results){
        if (err) {
            return next(err);
        }
        res.send(results);
    });
});


// get one item
app.get('/collections/:collectionName/:id', function(req, res) {
    req.collection.findOne({_id: req.collection.id(req.params.id)}, function(err, result){
        if (err) {
            return next(err);
        }
        res.send(result);
    })
});


// update item
app.put('/collections/:collectionName/:id', function(req, res) {
    req.collection.update({_id: req.collection.id(req.params.id)}, { $set:req.body }, { safe:true, multi:false }, function(err, result){
        if (err) {
            return next(err);
        }
        res.send((result===1)?{msg:'success'}:{msg:'error'});
    })
});


// delete item
app.del('/collections/:collectionName/:id', function(req, res) {
    req.collection.remove({_id: req.collection.id(req.params.id)}, function(err, result){
        if (err) {
            return next(err);
        }
        res.send((result===1)?{msg:'success'}:{msg:'error'});
    })
});


// run server
app.listen(3000);