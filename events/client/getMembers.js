module.exports = (client, Discord) => {
    console.log(client.name);
    guild = client.guilds.cache.get("868859908332851220")
    console.log(`guild: ${guild}`)
    guild.members.fetch().then(members => {
        console.log(members);
    });
}