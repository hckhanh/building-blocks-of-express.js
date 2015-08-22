var express = require('express');
var app = express();
var logger = require('./logger');

var locations = {
	'Fixed': 'First floor',
	'Movable': 'Second floor',
	'Rotating': 'Third floor'
};

app.use(express.static('public'));
app.use('/js', express.static('public/js'));

app.use('/css', express.static('node_modules/bootstrap/dist/css'));
app.use('/fonts', express.static('node_modules/bootstrap/dist/fonts'));
app.use('/js', express.static('node_modules/bootstrap/dist/js'));

app.use(logger);


app.param('name', function (req, res, next) {
	var name = req.params.name;
	
	req.blockName = name[0].toUpperCase() + name.slice(1).toLowerCase();
	next();
});

var blocks = require('./routers/blocks.js');
app.use('/blocks', blocks);
	
app.get('/locations/:name', function (req, res) {
	var location = locations[req.blockName];

	if (location) {
		res.json(location);
	} else {
		res.status(404).json('No description found for ' + req.blockName);
	}

});

app.listen(6789);