const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../blog-swagger-api.json');
const rateLimit = require('express-rate-limit');
const app = express();
const helmet = require('helmet');
const limiter = rateLimit({
	windowMs: 60,
	max: 12,
});


app.use(helmet());
app.use(limiter);
app.use(
	cors({
		origin: '*',
	}),
	express.json()
);
app.use(morgan('dev'));
-
app.get('/api/v1/docs',swaggerUi.setup(swaggerDocument));

app.use('/api/v1/', swaggerUi.serve);

module.exports = app;
