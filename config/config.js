const dotenv = require('dotenv');
dotenv.config({ path: __dirname + `/../.env.${process.env.NODE_ENV}` });

const config = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.NODE_PORT || 3000,
	limit: process.env.LIMIT || 10,
	skip: process.env.SKIP || 0,
	jwtSecret: process.env.JWT_SECRET,
	jwtEpiresIn: process.env.JWT_EXPIRES_IN,
	dbURI: process.env.DB_URI,
};

module.exports = config;
