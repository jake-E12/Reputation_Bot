const { levelController, LevelCheck, addPoints, addLevels } = require("../../handlers/level_handler");
module.exports = (client, Discord, message) => {

    let words = ["thank you", "thanks", "thx", "cheers", "thnks"];
    let id = "";
    if (words.some(word => message) && !message.author.bot) {
        //console.log(message);
        if (message.content.includes("<@!", /^0|[1-9]\d*$/, ">")) {
            let msg = message.content.split(" ");
            msg.forEach(element => {
                if (element.includes("<@!", /^0|[1-9]\d*$/, ">")) {
                    let id_ = element.slice(3, 21);
                    console.log(id_)
                    if (message.author.id != id_) {
                        addPoints(id_, 5);
                        setTimeout(() => {
                            console.log("Checking level");
                            const lvl = addLevels(id_);
                            lvl.then(
                                function(value) {
                                    console.log(`Value : ${value}`);
                                    if (value != false) {
                                        message.guild.channels.cache.get("896807549385461781").send(`User: <@!${id_}> has progressed to level: ${value + 1}`);
                                    }
                                },
                                function(error) {
                                    console.log(`Error: ${error}`);
                                }
                            )
                        }, 3000);

                    } else {
                        console.log("Naughty");
                        message.reply("Please do not try to farm rep points as this is bannable");
                    }
                }
            });
        }
    }


    // command handler message

    let prefix = client.prefix;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if (command) command.execute(client, message, args, Discord);
}