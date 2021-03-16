const commandBase = require("../command-base");
const client = require("../../index")
const Discord = require('discord.js');
// Standard botinfo command to retrieve information about Kali. Nothing much to see here....
module.exports = {
    commands: ['github', 'gh'],
    minArgs: 0,
    callback: async (message, arguments, text) => {
        const embed = new Discord.MessageEmbed();
        embed.setTitle("Kali's Github Repository")
        .setColor("#FF003E")
        .setThumbnail(client.user.avatarURL())
        .setDescription("Kali's Github Repository is where you can help contribute to the bot and submit any issues/bugs you find. Don't forget to star and share the bot with your friends! :star:\n**Link:** https://github.com/ArhumJain/kali")
        message.channel.send(embed);
    }
}
