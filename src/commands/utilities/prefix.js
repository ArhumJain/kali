const { DiscordAPIError } = require('discord.js');
const mongo = require('../../mongo');
const schema = require('../../schemas/prefix-schema');
const commandBase = require("../command-base");
const Discord = require('discord.js');
module.exports = {
    commands: ['setprefix'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "[New command prefix]",
    permissionError: 'You must be an admin to execute the `!setprefix` command!',
    // permissions: 'ADMINISTRATOR',
    callback: async (message, arguments, text) => {
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
                await schema.findOneAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    prefix: arguments[0]
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