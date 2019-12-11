/*
	** 
	**	EDI-Checker 
	** 	server.js
	** 	Author: Daniel Grewe, 2019
	**
	**	Last change:	
	** 
*/

const express 		= require('express');
const bodyParser 	= require('body-parser');
const xmlParser 	= require('express-xml-bodyparser');
const fs			= require('fs');
const nodeSSPI 		= require('node-sspi');
const sql 			= require('mssql');
const winston 		= require('winston');
const sqlConfig		= require('./config/sql.js');
const adminConfig	= require('./config/admins.js');

const app 			= express();
const port			= process.env.PORT || 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

logger.info('------------------------------------------');
logger.info('Packages loaded.');

// track permission
var dataObj = {
	user: {
		auth: false,
		name: '',
		nameString: '',
		role: ''
	},
	content: {}
};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xmlParser());

// SSO middleware
app.use(function (req, res, next) {
	var nodeSSPIObj = new nodeSSPI({
		retrieveGroups: true
	})
	nodeSSPIObj.authenticate(req, res, function(err){
		res.finished || next()
	})
})
app.use(function(req, res, next) {
	dataObj.user.auth = true;
	dataObj.user.name = req.connection.user;
	dataObj.user.nameString = req.connection.user; 
	next();
})

logger.info('App and middlewares configured.');
logger.info('------------------------------------------');

// SQL test with request 
sql.connect(sqlConfig, function (err) {
	logger.info('Testing SQl connection.');
	logger.info('------------------------------------------');
	if (err) logger.error('Testing SQL connection FAILED. ' + err);
	var request = new sql.Request(); 
	request.query('select * from TEST', function (err, recordset) {	
		if (err) logger.error('Testing SQL query FAILED. ' + err)
		if (!err) {
			logger.info('Testing SQL connection SUCCEEDED.');
			logger.info(JSON.stringify(recordset));
		};
	});
});

app.get('/helloworld', function (req, res) {
	logger.info('New GET request /helloworld');
	res.send('Hello World!')
});

app.post('/check', function (req, res) {
	logger.info('New POST request /check');
	//res.render('index');
	console.log(req.body);
});

app.listen(port, function () {
	logger.info('------------------------------------------');
	logger.info('Express server started.');
	logger.info('Listening on port ' + port + '.');
	logger.info('Server in ' + app.get('env') + ' mode.');
	logger.info('------------------------------------------');
});


