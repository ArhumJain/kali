const mongo = require('../../mongo');
const schema = require('../../schemas/server-settings');
const commandBase = require("../command-base");
const logsBase = require("../logs-base");
const Discord = require('discord.js');
module.exports = {
    commands: ['setprefix'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "[New command prefix]",
    permissionError: 'You must be an admin to execute the `!setprefix` command!',
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments, text) => {
        // Need to connect to MongoDB to store/update newly updated or added custom prefix
        await mongo().then(async mongoose =>{
            const embed = new Discord.MessageEmbed()
            .setTitle("Prefix Utility")
            .setColor("#FF003E")
            .setThumbnail(message.guild.iconURL())
            .addFields({
                name: "The server prefix was successfully changed!",
                value: `${message.author.tag} changed the prefix to \`${arguments[0]}\``
            })
            try{
                // Update MongoDB collection
                await schema.findOneAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    prefix: arguments[0],
                    // isLogsEnabled: logsBase.isLogsEnabled(message.guild.id),
                    // logsChannel: logsBase.getLogsChannel(message.guild.id),
                }, {
                    upsert: true
                })
                commandBase.updatePrefix(message.guild.id, arguments[0]);
                message.reply(embed);
            }
            finally{
                mongoose.connection.close()
            }
        })
    }
}