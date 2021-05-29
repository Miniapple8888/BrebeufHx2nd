const {sequelize} = require('./index'); // Index js file in models folder

// Models
const User = require('./user');
const Interest = require('./interest');
const {LearningLanguage, SpokenLanguage} = require('./language');

async function synchronize() {
    // User - Interest
    await sequelize.models.User.belongsToMany(sequelize.models.Interest, { through: 'User_Interest' });
    await sequelize.models.Interest.belongsToMany(sequelize.models.User, { through: 'User_Interest' });
    // User - Learning Language
    await sequelize.models.User.belongsToMany(sequelize.models.LearningLanguage, { through: 'User_LearningLanguage' });
    await sequelize.models.LearningLanguage.belongsToMany(sequelize.models.User, { through: 'User_LearningLanguage' });
    // User - Spoken Language
    await sequelize.models.User.belongsToMany(sequelize.models.SpokenLanguage, { through: 'User_SpokenLanguage' });
    await sequelize.models.SpokenLanguage.belongsToMany(sequelize.models.User, { through: 'User_SpokenLanguage' });

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

module.exports = {User, Interest, LearningLanguage, SpokenLanguage, synchronize};