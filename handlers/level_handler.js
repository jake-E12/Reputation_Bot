const mongoose = require('mongoose');
const bot_config = require('../bot_config.json');
const UserSchema = new mongoose.Schema({
    id_: Number,
    level: Number,
    points: Number
});

const User = mongoose.model('User', UserSchema);
User.createCollection().then((collection) => {
    console.log("collection has been crearted");
});

// adds users to the db 
async function addUsers(id) {
    await mongoose.connect(bot_config.URL);
    const list = await (await User.find({ id_: id }));
    // tests to see if the return of User.find is greater 1, this means that it has found 1 => of the same id in the db
    if (list.length >= 1) {
        console.log(`found ${id} is already in the system`);
        return;
    } else {
        let user = new User({ id_: id, level: 1, points: 0 });
        try {
            await user.save();
            console.log(`saving: ${id}`)
        } catch (error) {
            console.log(error);
        }
    }

}



// remmoves users and logs the num of left users.
async function removeUsers(id) {
    console.log(id);
    mongoose.connect(bot_config.URL);
    let user = await ((await User.find({ id_: id })).map(num => num.id_));
    console.log(user)
    const leftUsers = await User.deleteOne({ id_: user });
    leftUsers.deletedCount;
}



async function addPoints(id, points_) {
    mongoose.connect(bot_config.URL);
    let user = await ((await User.find({ id_: id })));
    let Points = await ((await User.find({ id_: id })).map(num => num.points)).toString();
    Points = parseInt(Points);
    Points += points_;
    const update = await User.updateOne({ id_: id }, { points: parseInt(Points) });
    console.log("Updated the db with new data" + `update: ${update}`)
    console.log(`User id: ${id}, User Points : ${Points}`);
    return id;
}

async function addLevels(id) {
    console.log("Adding Levels");
    mongoose.connect(bot_config.URL);
    let points_ = await ((await User.find({ id_: id })).map(points_ => points_.points)).toString();
    let lvl = parseInt(await ((await User.find({ id_: id })).map(num => num.level)).toString());
    let mutiplyer = 0;
    points_ = parseInt(points_);
    console.log();
    if (lvl >= 5) {
        mutiplyer = lvl * 30;
    } else {
        mutiplyer = lvl * 10;
    }
    console.log(mutiplyer);
    if (points_ >= mutiplyer) {
        console.log(`Level up : ${id}`);
        const update = await User.updateOne({ id_: id }, { $inc: { level: +1 } });
        return lvl;
    } else {
        console.log("User does not have enough points to level up yet");
        return false;
    }
}


module.exports = {
    removeUsers,
    addUsers,
    addPoints,
    addLevels
};