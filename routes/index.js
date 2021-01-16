const authenticated = require('../middlewares').authenticated;
const userController = require('../controllers').user;
const sessionController = require('../controllers').session;
const resetPasswordController = require('../controllers').resetPassword;

module.exports = (app) => {
    app.get('/', (req, res) => res.status(200).send({
        message: 'Welcome to the users API!',
    }));
    app.get('/login', authenticated, sessionController.new);
    app.post('/login', authenticated, sessionController.create);
    app.post('/signup', authenticated, userController.create);
    app.post('/verify', authenticated, userController.verify);
    app.post('/logout', authenticated, sessionController.destroy);
    app.post('/forgot', authenticated, resetPasswordController.forgot);
    app.post('/verify-reset', authenticated, resetPasswordController.verifyReset);
    app.post('/reset', authenticated, resetPasswordController.reset);
}