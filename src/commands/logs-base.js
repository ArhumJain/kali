const mongo = require('../mongo');
const logsEnabledSchema = require("../schemas/server-settings");
const enabledServers = {};
const Discord = require("discord.js");
require('dotenv').config();

// Global method which allows other commands to retrieve whether audit logging to a channel is enabled.
const isLogsEnabled = (guildId) => {
    if (enabledServers.hasOwnProperty(guildId))
    {
        return true;
    }
    else{
        return false;
    }
}
// Global method which allows other commands to retrieve the channel id to which audits are being logged to.
const getLogsChannel = (guildId) => {
    if (isLogsEnabled(guildId)){
        return enabledServers[guildId];
    }
    else{
        return undefined;
    }
}

// Initiate primary event listeners to fire when events occur and then log to channels
module.exports = (client) =>{
    const embed = new Discord.MessageEmbed();
    const LIGHTBLUE = "#afe3e9";
    const GREEN = "#00DC6E";
    const RED = "#FB3F15";
    client.on("channelCreate", (channel) => {
        if(isLogsEnabled(channel.guild.id))
        {
            embed.setTitle("Channel Created")
            .setFooter(`Type: ${channel.type} • ID: ${channel.id}`)
            .setColor(GREEN)
            .setDescription(`The channel <#${channel.id}> was created`)
            console.log(getLogsChannel(channel.guild.id));
            client.channels.cache.get(getLogsChannel(channel.guild.id)).send(embed);
        }
    })
}

// Called when the bot starts up in index.js. Appends the servers (read from the DB) which have audit logging enabled to the enabledServers object.
module.exports.loadLogSettings = async (client) =>{
    await mongo().then(async mongoose => {
        try {
            for(const guild of client.guilds.cache){
                const result = await logsEnabledSchema.findOne({_id: guild[1].id});
                if (result == null) {
                    continue;
                }
                else{
                    if (result.isLogsEnabled)
                    {
                        enabledServers[guild[1].id] = result.logsChannel;
                    }
                    
                }
            }
            console.log(enabledServers);
        }
        finally {
            mongoose.connection.close();
        }
    })
}
// Method which simply appends the passed in guild key to the enabledServers object and assigns a channelID to it
module.exports.updateLogsChannel = (guildId, newChannel) =>{
    enabledServers[guildId] = newChannel;
}
// Disable a server for audit logging to a channel by removing the guild id passed in from the enabledServers object
module.exports.disableLogsChannel = (guildId) => {
    delete enabledServers[guildId];
}
// Check if audit logging is enabled for the guild id passed in
module.exports.isLogsEnabled = (guildId) =>{
    return isLogsEnabled(guildId);
}
// Get the channel to which audits are being logged to for the guild id passed in
module.exports.getLogsChannel = (guildId) => {
    return getLogsChannel(guildId);
}