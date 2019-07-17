var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Sponsor = require('../../models/Sponsor');
var Volunteer = require('../../models/Volunteer');



router.get('/',function(req,res) {
    res.send('Utility API Works');
});



router.post('/addsponsor',function(req,res) {
    // console.log(req.body);
    Sponsor.create(req.body).then((msg) => {
        res.send({message : "Added"});
    }).catch((err) => {
        res.send({message : err.toString()});
    });
});


router.post('/addvolunteer',function(req,res) {
    // console.log(req.body);
    Volunteer.create(req.body).then((msg) => {
        res.send({message : "Added"});
    }).catch((err) => {
        res.send({message : err.toString()});
    });
});


router.get('/allsponsor',function(req,res){
    Sponsor.find({},{_id : 0, __v:0}).then((data) => {
        let i=0,ret = [];
        while( i < data.length){
            ret.push([]);
            for(const key of Object.keys(data[i]['_doc'])){
                // console.log(key)
                ret[i].push(data[i][key]);
            }
            i++;
        }
        res.status(200).send({data : ret});
    }).catch((err) => {
        res.send({message : err.toString()});
    });
});


router.get('/allvolunteer',function(req,res){
    Volunteer.find({},{_id : 0, __v:0}).then((data) => {
        let i=0,ret = [];
        while( i < data.length){
            ret.push([]);
            for(const key of Object.keys(data[i]['_doc'])){
                // console.log(key)
                ret[i].push(data[i][key]);
            }
            i++;
        }
        res.status(200).send({data : ret});
    }).catch((err) => {
        res.send({message : err.toString()});
    });
});












module.exports = router;