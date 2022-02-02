const Discord = require('discord.js');
const { Intents } = require('discord.js');
const bot_config = require('./bot_config.json');
const message = require('./events/guild/message');
const { removeUsers, addUsers } = require('./handlers/level_handler');
const client = new Discord.Client({ intents: [Intents.GUILD_MEMBERS] });
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.prefix = bot_config.prefix;



['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord, message);
});

client.login(bot_config.token);

// when a new users joins this calls user add function.
client.on('guildMemberAdd', members => {
    initAddUsers();
});

// when user leaves this removes the users form the db.
client.on('guildMemberRemove', member => {
    removeUsers(member.id)
});

client.on('message', message => {

})



function initAddUsers() {
    guild_ = client.guilds.cache.get('868859908332851220');

    console.log("guild has been got")
        // Fetch and get the list named 'members'
    let members = guild_.members.fetch().then(members => {

        // Loop through every members
        members.forEach(member => {
            // split id into array and add each one to the db with defualt prams.
            let id = member.id.split();
            id.forEach(element => {
                try {
                    addUsers(element);

                } catch (error) {
                    console.error(error);
                }
            });

        });

    });

}

module.exports = initAddUsers;

setTimeout(() => {
    console.log("Addinbg init");
    initAddUsers;
}), 30000;