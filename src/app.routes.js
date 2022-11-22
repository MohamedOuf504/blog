
const requestIp = require('request-ip');
const app = require("./app.middlewares");
const AppError = require("./utils/appError");
const timeFormat = require('./utils/timeFormat')
const authController = require("./modules/User/auth.Controller");
const errorHandler = require("./middlewares/errorHandler");
const { userRouter } = require("./modules/User/user.Routes");
const { postRouter } = require("./modules/Post/post.Routes");
const { statistics } = require('./modules/User/admin.Controller');


app.use(userRouter)

app.use(postRouter)

app.get('/admin/statistics/', authController.protect, authController.restrictTo('ADMIN'), statistics)


app.get('/api/v1/health', authController.protect, authController.restrictTo('ADMIN'), (req, res) => {

    const uptime = timeFormat(process.uptime().toString());
    const { ip, url, hostname: host, headers } = req;

    const memory = process.memoryUsage();
    const memoryGB = (memory.heapUsed / 1024 / 1024 / 1024).toFixed(4) + ' GB';
    const clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1

    const healthCheck = {
        uptime,
        message: 'OK',
        time: new Date(),
        memoryGB,
        ip,
        url,
        host,
        forwardedHost: headers['x-forwarded-host'],
        clientIp,
    };

    res.status(200).json(healthCheck);
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);
module.exports = app;