const mongo = require('../../mongo');
const schema = require('../../schemas/server-settings');
const client = require("../../index");
const commandBase = require("../command-base");
const logsBase = require("../logs-base");
const Discord = require('discord.js');
module.exports = {
    commands: ['enablelogs'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "[Channel ID]",
    permissionError: 'You must be an admin to execute the `!enablelogs` command!',
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments, text) => {
        // Need to connect to MongoDB to store/update info
        const channel = arguments[0];
        const guild = message.guild;
        if(guild.channels.cache.has(channel)){
            if(client.channels.cache.get(channel).isText()){
                await mongo().then(async mongoose =>{
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Enable Logs")
                    .setColor("#FF003E")
                    .setThumbnail(guild.iconURL())
                    .setFooter(`Logs Channel ID: ${channel}`)
                    .addFields({
                        name: "The audit logs channel was successfully changed/enabled!",
                        value: `All audit logs will now be posted to the channel <#${channel}>`
                    })
                    try{
                        // Update MongoDB collection
                        await schema.findOneAndUpdate({
                            _id: guild.id
                        }, {
                            _id: guild.id,
                            prefix: commandBase.getGuildPrefix(guild.id),
                            isLogsEnabled: true,
                            logsChannel: channel,
                        }, {
                            upsert: true
                        })
                        logsBase.updateLogsChannel(guild.id, channel);
                        message.reply(embed);
                    }
                    finally{
                        mongoose.connection.close()
                    }
                })
            } else {
                message.reply("The channel specified must be a text based channel!")
            }
        }
        else{
            message.reply(`The channel id \`${channel}\` is either invalid or does not exist in this server!`)
        }
    }
}