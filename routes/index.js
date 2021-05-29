///const multer = require('multer');
// var upload = multer({ dest: 'client/rpublic/uploads/' });
const authenticated = require('../middlewares').authenticated; // Authentification
const userController = require('../controllers').user; // Sign up
const sessionController = require('../controllers').session; // Login
const profileController = require('../controllers').profile; // Profile
const resetPasswordController = require('../controllers').resetPassword;

module.exports = (app) => {
    app.get('/', (req, res) => res.status(200).send({
        message: 'Welcome to the Langr API!'
    }));
    app.get('/login', authenticated, sessionController.new); // What is this???
    app.post('/login', authenticated, sessionController.create); // Login create token
    app.post('/signup', userController.validateCredentials, userController.create); // Create an account
    app.post('/verify', userController.verify); // Verify by email the token
    app.post('/logout', authenticated, sessionController.destroy); // Log out
    app.post('/forgot', authenticated, resetPasswordController.forgot); // Forgot password
    app.post('/verify-reset', authenticated, resetPasswordController.verifyReset);
    app.post('/reset', authenticated, resetPasswordController.validateNewPassword, resetPasswordController.reset);
    app.post('/profile', authenticated, profileController.getProfile);
}