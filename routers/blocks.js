var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var ZSchema = require('z-schema');
var options = {
	noEmptyStrings: true
};
var validator = new ZSchema(options);
var fs = require('fs');

var blockDetails = {
	'Fixed': 'Fastened securely in position',
	'Movable': 'Capable of being moved',
	'Rotating': 'Moving in a circle around its center'
};

router.route('/')
	.get(function (req, res) {
		var blocks = Object.keys(blockDetails);
		var limit = req.query.limit;
		if (limit > 0) {
			res.json(blocks.slice(0, limit));
		} else {
			res.json(blocks);
		}
	})
	.post(parseUrlencoded, function (req, res) {
		var newBlock = req.body;
		fs.readFile('./blockSchema.json', function (err, data) {
			if (err)
				return res.status(404).json('File not found');

			validator.validate(newBlock, JSON.parse(data), function (err, valid) {
	    		if (valid) {
	    			blockDetails[newBlock.name] = newBlock.description;
	    			res.status(201).json(newBlock.name);
	    		} else {
	    			res.status(400).json('Invalid format!');
	    		}
			});
		});
	});

router.route('/:name')
	.all(function (req, res, next) {
		var name = req.params.name;
		req.blockName = name[0].toUpperCase() + name.slice(1).toLowerCase();

		next();
	})
	.get(function (req, res) {
		var description = blockDetails[req.blockName];

		if (description) {
			res.json(description);
		} else {
			res.status(404).json('No description found for ' + req.blockName);
		}

	})
	.delete(function (req, res) {
		delete blockDetails[req.blockName];
		res.sendStatus(200);
	});

module.exports = router;