/*
	** 
	**	EDI-Checker 
	** 	config/sql.js
	** 	Author: Daniel Grewe, 2019
	**
	**	Last change: 02.08.2019
	** 
*/

const driver 		= 'SQL Server Native Client 11.0';
const server 		= 'localhost';
const user 			= 'Nodejs';
const password 		= 'pw';
const database 		= 'edichecker';
const trustedConn 	= true;
const conn_str 		= "Driver={" + driver + "};Server=" + server + ";" + (trustedConn == true ? "Trusted_Connection={Yes};" : "UID=" + user + ";PWD=" + pwd + ";") + "Database={" + database + "};";

exports.database = database;
exports.server = server;
exports.user = user;
exports.password = password;
