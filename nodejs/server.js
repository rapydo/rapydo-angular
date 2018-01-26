'use strict';

const express = require('express');
const fs = require('fs')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Static folders
app.use('/static/custom/js', express.static('/app/frontend/js'));
app.use('/static/custom/css', express.static('/app/frontend/css'));
app.use('/static/custom/templates', express.static('/app/frontend/templates'));

app.use('/static/assets', express.static('/app/frontend/assets'));

app.use('/static/commons/js', express.static('/rapydo/js/angular'));
app.use('/static/commons/css', express.static('/rapydo/css'));
app.use('/static/commons/templates', express.static('/rapydo/templates'));

app.use('/static/fonts', express.static('/rapydo/fonts'));
app.use('/static/modules', express.static('/modules/node_modules'));

app.get('/static/config.js', (req, res) => {
	var port = process.env.BACKEND_PORT;
	var host = process.env.BACKEND_HOST;

	if (fs.existsSync("/app/frontend/templates/topbar.html")) {
		var topbar_type = "custom"
	} else {
		var topbar_type = "common"
	}

	var conf = "";
	conf += "var apiPort = '"+port+"';"
	conf += "var serverUrl = 'http://"+host+"';"
	conf += "var topbar_type = '"+topbar_type+"';"
	res.status(200).send(conf);
});

app.get('/static/*', (req, res) => {
	res.sendStatus(404);
});


app.get('*', (req, res) => {
	res.status(200).sendFile('/rapydo/index.html');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

