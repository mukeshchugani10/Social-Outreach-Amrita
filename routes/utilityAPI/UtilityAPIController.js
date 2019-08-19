var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Sponsor = require('../../models/Sponsor');
var Volunteer = require('../../models/Volunteer');
var Event = require('../../models/events');
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
			</xs:sequence>
		</xs:complexType>
	</xs:element>
</xs:schema>`


router.post('/addevent', function (req, res) {
    try {
        let xmlString = libxmljs.parseXml(req.body.doc)
        let xsdDoc = libxmljs.parseXml(xsd)
        let result = xmlString.validate(xsdDoc);
        if (result == true) {
            var event = {
                url: xmlString.root().childNodes()[0].text(),
                heading: xmlString.root().childNodes()[1].text(),
                text: xmlString.root().childNodes()[2].text()
            }
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









module.exports = router;