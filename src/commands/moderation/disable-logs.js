const mongo = require('../../mongo');
const schema = require('../../schemas/server-settings');
const client = require("../../index");
const commandBase = require("../command-base");
const logsBase = require("../logs-base");
const Discord = require('discord.js');
module.exports = {
    commands: ['disablelogs'],
    minArgs: 0,
    permissionError: 'You must be an admin to execute the `!enablelogs` command!',
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments, text) => {
        const guild = message.guild;
        if(logsBase.isLogsEnabled(message.guild.id)){
            await mongo().then(async mongoose =>{
                const embed = new Discord.MessageEmbed()
                .setTitle("Disable Logs")
                .setColor("#FF003E")
                .setThumbnail(guild.iconURL())
                .setDescription("**Channel logging is now disabled for this server**")
                try{
                    await schema.findOneAndUpdate({
                        _id: guild.id
                    }, {
                        _id: guild.id,
                        prefix: commandBase.getGuildPrefix(guild.id),
                        isLogsEnabled: false,
                        logsChannel: undefined,
                    }, {
                        upsert: true
                    })
                    logsBase.disableLogsChannel(guild.id);
                    message.reply(embed);
                }
                finally{
                    mongoose.connection.close()
                }
            })
        }
        else{
            message.reply(`Channel logging is already disabled!`)
        }
    }
}