const commandBase = require("../command-base");
const logsBase = require("../logs-base");
const Discord = require('discord.js');
// Sorry for wonky file name. Couldn't quite figure out what to name this file so it was clearly to interpret what it's command actually did.
// Simply, this just retrieves if audit logging to a channel in the server is enabled.
module.exports = {
    commands: ['logsenabled'],
    minArgs: 0,
    callback: async (message, arguments, text) => {
        const guildId = message.guild.id;
        const embed = new Discord.MessageEmbed();
        const prefix = commandBase.getGuildPrefix(message.guild.id);
        if(logsBase.isLogsEnabled(guildId)){
            embed.setTitle("Logs enabled")
            .setColor("#FF003E")
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
            .setDescription("Channel Audit Logs are currently enabled for this server! The may or may not be seen by standard users.");
            message.channel.send(embed);
        } 
        else {
            embed.setTitle("Logs disabled")
            .setColor("#FF003E")
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
            .setDescription(`Channel Audit Logs are currently disabled for this server. An admin can enable them using \`${prefix}enablelogs [Channel Id]\``);
            message.channel.send(embed);
        }
    }
}