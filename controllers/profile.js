const {User} = require('../models/models'); // Database models

module.exports = {
    async getProfile(req, res) {
        const requestUserId = req.body.requestedUser || "";
        const email = req.currentUser;

        await User.findOne({ where: { id: requestUserId } }).then(user => { // Get user profile
            if (email) { // User logged in
                if (email === user.email) { // User viewing own profile
                    return res.status(202).send({
                        type: "private",
                        first_name: user.firstName,
                        last_name: user.lastName,
                        email: user.email,
                    });
                } else {
                    return res.status(202).send({ // Logged in user viewing other profile
                        type: "public",
                        first_name: user.firstName,
                        last_name: user.lastName,
                    });
                }
            } else { // No user logged in
                return res.status(202).send({
                    type: "public",
                    first_name: user.firstName,
                    last_name: user.lastName,
                });
            }
        }).catch(err => {
            return res.status(202).send({
                error: "Profile not found."
            })
        });

        
    }
}