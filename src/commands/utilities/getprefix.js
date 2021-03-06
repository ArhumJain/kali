const commandBase = require("../command-base");
const Discord = require('discord.js');
module.exports = {
    commands: ['prefix'],
    minArgs: 0,
    callback: async (message, arguments, text) => {
        // Obtain current server prefix to send to the user
        const serverPrefix = commandBase.getGuildPrefix();
        const embed = new Discord.MessageEmbed()
        .setTitle("Server Prefix")
        .setColor("#FF003E")
        .setFooter("Admins can use `!setprefix [prefix]` to change the server prefix to a custom prefix!")
        .setThumbnail(message.guild.iconURL())
        .addFields({
            name: "__Prefix__",
            value: `The server prefix is \`${serverPrefix}\``,
        });
        message.channel.send(embed);
    }
}