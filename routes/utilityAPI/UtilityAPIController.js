var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Sponsor = require('../../models/Sponsor');
var Volunteer = require('../../models/Volunteer');
var Event = require('../../models/events');
var EventSponsor = require('../../models/eventsponsor');
var EventVolunteer = require('../../models/eventvolunteer');
var libxmljs = require('libxmljs')
// libxml.loadSchemas(['/home/harshit/Desktop/Git/Social-Outreach-Amrita/event.xsd'])

router.get('/', function (req, res) {
    res.send('Utility API Works');
});



router.post('/addsponsor', function (req, res) {
    // console.log(req.body);
    Sponsor.create(req.body).then((msg) => {
        res.send({ message: "Added" });
    }).catch((err) => {
        res.send({ message: err.toString() });
    });
});


router.post('/addvolunteer', function (req, res) {
    // console.log(req.body);
    Volunteer.create(req.body).then((msg) => {
        res.send({ message: "Added" });
    }).catch((err) => {
        res.send({ message: err.toString() });
    });
});


router.get('/allsponsor', function (req, res) {
    Sponsor.find({}, { _id: 0, __v: 0 }).then((data) => {
        let i = 0, ret = [];
        while (i < data.length) {
            ret.push([]);
            for (const key of Object.keys(data[i]['_doc'])) {
                // console.log(key)
                ret[i].push(data[i][key]);
            }
            i++;
        }
        res.status(200).send({ data: ret });
    }).catch((err) => {
        res.send({ message: err.toString() });
    });
});


// async function getVolunteers(){
//     var A = await Volunteer.aggregate([
//         {
//             $match : {}
//         },{
//             $lookup : {
//                 from : 'eventvolunteers',
//                 localField : 'email',
//                 foreignField : 'email',
//                 as : 'event'
//             }   
//         }
//     ])
// }


router.get('/allvolunteer', function (req, res) {
    Volunteer.find({}, { _id: 0, __v: 0 }).then((data) => {
        let i = 0, ret = [];
        while (i < data.length) {
            ret.push([]);
            for (const key of Object.keys(data[i]['_doc'])) {
                // console.log(key)
                ret[i].push(data[i][key]);
            }
            i++;
        }
        res.status(200).send({ data: ret });
    }).catch((err) => {
        res.send({ message: err.toString() });
    });
});

let xsd = `<?xml version="1.0" encoding="utf-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xs:element name="data">
		<xs:complexType>
			<xs:sequence>
                <xs:element name="url" type="xs:string" />
                <xs:element name="title" type="xs:string" />
                <xs:element name="text" type="xs:string" />
                <xs:element name="volunteer" type="xs:string" />
                <xs:element name="sponsor" type="xs:string" />
                <xs:element name="longtext" type="xs:string" />
			</xs:sequence>
		</xs:complexType>
	</xs:element>
</xs:schema>`


router.post('/addevent', function (req, res) {
    try {
        let xmlString = libxmljs.parseXml(req.body.doc)
        let xsdDoc = libxmljs.parseXml(xsd)
        let result = xmlString.validate(xsdDoc);
        console.log(req.body.doc);
        if (result == true) {
            var event = {
                url: xmlString.root().childNodes()[0].text(),
                heading: xmlString.root().childNodes()[1].text(),
                text: xmlString.root().childNodes()[2].text(),
                longtext : xmlString.root().childNodes()[5].text()
            }
            
            var volunteer =  xmlString.root().childNodes()[3].text().split(",");
            volunteer.forEach(element => {
                var d = {
                    url : event.url,
                    email : element
                };
                EventVolunteer.create(d);      
            });

            var sponsor =  xmlString.root().childNodes()[4].text().split(",");
            sponsor.forEach(element => {
                var d = {
                    url : event.url,
                    email : element
                };
                EventSponsor.create(d);      
            });

            Event.create(event).then((msg) => {
                res.status(200).send({ message: "Event updated" });
            }).catch((err) => {
                res.status(500).send({ message: err.toString() });
            })

        } else {
            res.status(400).send({ message: xmlString.validationErrors[0].toString() });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Server Error" });
    }
})


router.get('/getevents', function (req, res) {
    Event.find({}, { _id: 0, __v: 0 }).then((data) => {
        res.status(200).send({ data: data });
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    })
})


async function assignsponsor(url,email){
    var A = await Event.findOne({ url : url});
    if(!A){
        throw new Error('Invalid event');
    }

    var B = await Sponsor.findOne({ email : email});
    if(!B){
        throw new Error('Invalid Sponsor');
    }

    var data = {
        url : url,
        email : email
    };

    var newentry = new EventSponsor(data);
    var C = await newentry.save();

    return { message : "Sponsor assigned Successfully"};
}

router.post('/assignsponsor', function(req,res) {
    assignsponsor(req.body.url,req.body.email).then((doc) => {
        res.status(200).send(doc);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
});


async function assignvolunteer(url,email){
    var A = await Event.findOne({ url : url});
    if(!A){
        throw new Error('Invalid event');
    }

    var B = await Volunteer.findOne({ email : email});
    if(!B){
        throw new Error('Invalid Volunteer');
    }

    var data = {
        url : url,
        email : email
    };

    var newentry = new EventVolunteer(data);
    var C = await newentry.save();

    return { message : "Volunteer assigned Successfully"};
}

router.post('/assignvolunteer', function(req,res) {
    assignvolunteer(req.body.url,req.body.email).then((doc) => {
        res.status(200).send(doc);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
});

async function getEvent(url){
    var A = await Event.findOne({ url : url}, { _id: 0, __v: 0 });
    if(!A){
        throw new Error("Event Not found")
    }
    var B = await EventVolunteer.aggregate([
        {
            $match : { url : url}
        },{
            $lookup : {
                from : 'volunteers',
                localField : 'email',
                foreignField : 'email',
                as : 'volunteerdetails'
            }   
        }
    ]);

    var C = await EventSponsor.aggregate([
        {
            $match : { url : url}
        },{
            $lookup : {
                from : 'sponsors',
                localField : 'email',
                foreignField : 'email',
                as : 'sponsordetails'
            }   
        }
    ]);

    return {
        event : A,
        volunteer : B,
        sponsor : C
    }
}

router.post('/getevent', function(req,res){
    getEvent(req.body.url).then((doc) => {
        res.status(200).send(doc);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
});




async function getUnassignedSponsor(){
    var A = await EventSponsor.find({});
    var emails =  A.map((x) => {
        return x.email;
    })
    var B = await Sponsor.find({ email : { $nin : emails}});
    return { "data" : B };
}

router.get('/getunsponsor',function(req,res) {
    getUnassignedSponsor().then((doc) => {
        res.status(200).send(doc);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
})



async function getUnassignedVolunteer(){
    var A = await EventVolunteer.find({});
    var emails =  A.map((x) => {
        return x.email;
    })
    var B = await Volunteer.find({ email : { $nin : emails}});
    return { "data" : B };
}

router.get('/getunvolunteer',function(req,res) {
    getUnassignedVolunteer().then((doc) => {
        res.status(200).send(doc);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
})

router.post('/volunteerevent',function(req,res){
    EventVolunteer.findOne({email : req.body.email}).then((data) => {
        if(!data) {
            res.status(200).send({ name : `<button data-toggle="modal" data-target="#Modal_volunteer" onclick="setvolemail('${req.body.email}')">Assign Event</button>`});
        }else{
            Event.findOne({ url : data.url}).then((doc) => {
                res.status(200).send({ name : doc.heading});
            })
        }
    }).catch((err) => {
        res.status(500).send({ err : message.toString()});
    })
})

router.post('/sponsorevent',function(req,res){
    EventSponsor.findOne({email : req.body.email}).then((data) => {
        if(!data) {
            res.status(200).send({ name : `<button data-toggle="modal" data-target="#Modal_volunteer" onclick="setsponemail('${req.body.email}')">Assign Event</button>`});
        }else{
            Event.findOne({ url : data.url}).then((doc) => {
                res.status(200).send({ name : doc.heading});
            })
        }
    }).catch((err) => {
        res.status(500).send({ err : message.toString()});
    })
})



module.exports = router;