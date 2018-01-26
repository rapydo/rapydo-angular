'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Static folders
app.use('/static/custom', express.static('/app/frontend'));
app.use('/static/commons/js', express.static('/rapydo/js/angular'));
app.use('/static/commons/css', express.static('/rapydo/css'));
app.use('/static/commons/templates', express.static('/rapydo/templates'));
app.use('/static/fonts', express.static('/rapydo/fonts'));
app.use('/static/modules', express.static('/modules/node_modules'));

app.get('*', (req, res) => {
  res.status(200).sendFile('/rapydo/index.html');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

