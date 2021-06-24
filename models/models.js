const {sequelize} = require('./index'); // Index js file in models folder
const { Sequelize, DataTypes } = require('sequelize');

// Models
const User = require('./user');
const Interest = require('./interest');
const Language = require('./language');
const User_Language = require('./user_language');

async function synchronize() {
    // User - Interest
    await User.belongsToMany(Interest, { through: 'User_Interest' });
    await Interest.belongsToMany(User, { through: 'User_Interest' });
    // User - Language
    await User.belongsToMany(Language, { through: User_Language})
    await Language.belongsToMany(User, { through: User_Language})

    await sequelize.sync({force: false}).then(() => {
        console.log("Database synchronized.")
    }); // If 'force' == true then reset database tables at restart
}

// EXAMPLE
// (async () => {
//     var user = await sequelize.models.User.create({ first_name: "John", last_name: "Doe" });
//     var interest = await sequelize.models.Interest.create({ name: "stuff"});
//     await user.addInterest(interest, {through: "User_Interest"});
// })();

module.exports = {User, Interest, Language, User_Language, synchronize};