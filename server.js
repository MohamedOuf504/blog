process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

const mongoose = require('mongoose');
const config = require('./config/config');
const app = require('./src/app.routes');
const databaseURL = config.dbURI;
const port = config.port;
let server;

mongoose
	.connect(databaseURL, {
	
	})
	.then(async () => {
		console.log('Connected to DB');
		server = app.listen(port, () => {
			console.log('Current Date: ', new Date().toLocaleString());
			console.log('server running on:', port);
		});
	});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	console.log(err.name, err.message, err.stack);
	server.close(() => {
		process.exit(1);
	});
});
