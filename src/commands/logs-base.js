const mongo = require('../mongo');
const commandBase = require("./command-base");
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
const disableLogsChannel = (guildId) =>{
    delete enabledServers[guildId];
}   

// Initiate primary event listeners to fire when events occur and then log to channels
module.exports = (client) =>{
    const LIGHTBLUE = "#afe3e9";
    const GREEN = "#00DC6E";
    const RED = "#FB3F15";
    client.on("guildMemberAdd", (member) => {
        console.log("A new member joined the guild!")
        if(isLogsEnabled(member.guild.id)){
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Member Joined")
            .setColor(GREEN)
            .setTimestamp()
            .setThumbnail(member.user.avatarURL({dynamic : true}))
            .addFields({
                name:"__Identification__",
                value:`**User tag:** ${member.user.tag}\n**Number ID:** ${member.user.id}`
            },{
                name: "__Join Dates__",
                value: `**Joined Discord:** ${member.user.createdAt}\n**Joined Server:** ${member.joinedAt}`,
            });
            client.channels.cache.get(getLogsChannel(member.guild.id)).send(embed);
        }
    });
    client.on("guildMemberRemove", (member) => {
        if(isLogsEnabled(member.guild.id)){
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Member Left")
            .setColor(RED)
            .setTimestamp()
            .setThumbnail(member.user.avatarURL({dynamic : true}))
            .setDescription(
                `**User tag:** ${member.user.tag}\n**Number ID:** ${member.user.id}`
            );
            client.channels.cache.get(getLogsChannel(member.guild.id)).send(embed);
            console.log(`${member.user.tag} left the guild`)
        }
    })
    client.on("messageDelete", (message) => {
        if(isLogsEnabled(message.guild.id)){
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Message Deleted")
            .setColor(RED)
            .setTimestamp()
            .setFooter(`Author ID: ${message.author.id} • Message ID: ${message.id}`)
            .setDescription(`Message by <@${message.author.id}> deleted in <#${message.channel.id}>\n**Content:**\n${message.content}`);
            client.channels.cache.get(getLogsChannel(message.guild.id)).send(embed);
        }
    });
    client.on("messageUpdate", (oldMessage, newMessage) => {
        if(oldMessage.author.id != "816116634162167818"){
            if(isLogsEnabled(newMessage.guild.id)){
                const embed = new Discord.MessageEmbed();
                embed.setTitle("Message Edited")
                .setColor(LIGHTBLUE)
                .setTimestamp()
                .setFooter(`Author ID: ${newMessage.author.id} • Message ID: ${newMessage.id}`)
                .setDescription(`Message by <@${newMessage.author.id}> edited in <#${newMessage.channel.id}>\n**Original:**\n${oldMessage.content}\n**Edited:**\n${newMessage.content}`);
                client.channels.cache.get(getLogsChannel(oldMessage.guild.id)).send(embed);
            }
        }
    });
    client.on("emojiCreate", (emoji) => {
        if(isLogsEnabled(emoji.guild.id)){
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Emoji Created")
            .setTimestamp()
            .setColor(GREEN)
            .setFooter(`Emoji ID: ${emoji.id}`)
            .setDescription(`**Name:** ${emoji.name}\n**Animated**: ${emoji.animated}\n**Emoji:**\n${emoji.toString()}\n**Raw link:** ${emoji.url}`);
            client.channels.cache.get(getLogsChannel(emoji.guild.id)).send(embed);
        }
    });
    client.on("emojiUpdate", (oldEmoji, newEmoji) => {
        if(isLogsEnabled(oldEmoji.guild.id))
        {
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Emoji Updated")
            .setColor(LIGHTBLUE)
            .setFooter(`Emoji ID:  ${newEmoji.id}`)
            .addFields({
                name: "__Old Emoji__",
                value: `**Name:** ${oldEmoji.name}\n**Animated**: ${oldEmoji.animated}\n**Emoji:**\n${oldEmoji.toString()}\n**Raw link:** ${oldEmoji.url}`
            }, {
                name: "__Updated Emoji__",
                value: `**Name:** ${newEmoji.name}\n**Animated**: ${newEmoji.animated}\n**Emoji:**\n${newEmoji.toString()}\n**Raw link:** ${newEmoji.url}`
            });
            client.channels.cache.get(getLogsChannel(newEmoji.guild.id)).send(embed);
        }
    });
    client.on("emojiDelete", (emoji) => {
        if(isLogsEnabled(emoji.guild.id))
        {
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Emoji Deleted")
            .setTimestamp()
            .setColor(RED)
            .setDescription(`**Name:** ${emoji.name}\n**Animated**: ${emoji.animated}\n**Raw link:** ${emoji.url}`)
            .setFooter(`Emoji ID: ${emoji.id}`)
            client.channels.cache.get(getLogsChannel(emoji.guild.id)).send(embed);
        }

    });
    client.on("roleCreate", (role) => {
        if(isLogsEnabled(role.guild.id))
        {
            const embed = new Discord.MessageEmbed();
            embed.setTitle("New Role Created")
            .setTimestamp()
            .setColor(GREEN)
            .setDescription(`**Name:** ${role.name}\n**Color:** ${role.hexColor}\n**Role ID:** ${role.id}`);
            client.channels.cache.get(getLogsChannel(role.guild.id)).send(embed); 
        }
    });
    client.on("roleDelete", (role) => {
        if(isLogsEnabled(role.guild.id))
        {
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Role Deleted")
            .setTimestamp()
            .setColor(RED)
            .setDescription(`**Name:** ${role.name}\n**Color:** ${role.hexColor}\n**Role ID:** ${role.id}`);
            client.channels.cache.get(getLogsChannel(role.guild.id)).send(embed); 
        }
    });
    client.on("roleUpdate", (oldRole, newRole) => {
        if(isLogsEnabled(newRole.guild.id))
        {
            if(oldRole.name != newRole.name || oldRole.hexColor != newRole.hexColor)
            {
                const embed = new Discord.MessageEmbed();
                embed.setTitle("Role Updated")
                .setTimestamp()
                .setColor(newRole.hexColor)
                .setDescription(`**Name:** ${newRole.name}\n**Color:** ${newRole.hexColor}\n**Role ID:** ${newRole.id}`);
                client.channels.cache.get(getLogsChannel(newRole.guild.id)).send(embed);
            }
        }
    });
    client.on("guildBanAdd", (guild, user) => {
        if(isLogsEnabled(guild.id))
        {
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Member Banned")
            .setTimestamp()
            .setColor(RED)
            .setThumbnail(user.avatarURL())
            .setDescription(`A server member banned\n**Server Nickname:** ${guild.member(user).displayName}\n**User tag:** ${user.tag}\n**Number ID:** ${user.id}`);
            client.channels.cache.get(getLogsChannel(guild.id)).send(embed);

        }
    });
    client.on("guildBanRemove", (guild, user) =>
    {
        if(isLogsEnabled(guild.id))
        {
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Member Unbaned")
            .setTimestamp()
            .setColor(GREEN)
            .setThumbnail(user.avatarURL())
            .setDescription(`A server member was unbannned\n**User tag:** ${user.tag}\n**Number ID:** ${user.id}`);
            client.channels.cache.get(getLogsChannel(guild.id)).send(embed);
        }
    });
    client.on("channelCreate", (channel) => {
        if(isLogsEnabled(channel.guild.id))
        {
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Channel Created")
            .setFooter(`Type: ${channel.type} • ID: ${channel.id}`)
            .setColor(GREEN)
            .setTimestamp()
            .setDescription(`The channel <#${channel.id}> was **created**`);
            client.channels.cache.get(getLogsChannel(channel.guild.id)).send(embed);
        }
    });
    client.on("channelDelete", async (channel) => {
        if(isLogsEnabled(channel.guild.id)){
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Channel Deleted")
            .setFooter(`Type: ${channel.type} • ID: ${channel.id}`)
            .setColor(RED)
            .setTimestamp()
            .setDescription(`The channel with ID ${channel.id} was **deleted**`);
            if(getLogsChannel(channel.guild.id) == channel.id)
            {
                disableLogsChannel(channel.guild.id);
                // embed.setDescription(`The channel with ID ${channel.id} was **deleted**. Audit logs were also being logged to this channel and now they have been disabled for this server.`);
                await mongo().then(async mongoose =>{
                    try{
                        // Update MongoDB collection
                        await logsEnabledSchema.findOneAndUpdate({
                            _id: channel.guild.id
                        }, {
                            isLogsEnabled: false,
                            logsChannel: undefined,
                        }, {
                            upsert: true
                        })
                    }
                    finally{
                        mongoose.connection.close()
                    }
                });
            }
            else{
                client.channels.cache.get(getLogsChannel(channel.guild.id)).send(embed);
            }
            
        }
    });
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
    disableLogsChannel(guildId);
}
// Check if audit logging is enabled for the guild id passed in
module.exports.isLogsEnabled = (guildId) =>{
    return isLogsEnabled(guildId);
}
// Get the channel to which audits are being logged to for the guild id passed in
module.exports.getLogsChannel = (guildId) => {
    return getLogsChannel(guildId);
}