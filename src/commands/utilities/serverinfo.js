const commandBase = require("../command-base");
const Discord = require('discord.js');
module.exports = {
    commands: ['serverinfo', 'si'],
    minArgs: 0,
    callback: async (message, arguments, text) => {
        // Ehhh sticky/hacky way to get owner info but the standard way was returning undefined when doing message.guild.owner.user.tag
        message.guild.members.fetch(message.guild.ownerID).then(owner => {
            const guild = message.guild;
            // Get the channel counts for each type of channel and number of categories
            const textChannelCount = guild.channels.cache.filter((c) => c.type === "text").size
            const voiceChannelCount = guild.channels.cache.filter((c) => c.type === "voice").size
            const categoryChannelCount = guild.channels.cache.filter((c) => c.type === "category").size
            const newsChannelCount = guild.channels.cache.filter((c) => c.type === "news").size
            const storeChannelCount = guild.channels.cache.filter((c) => c.type === "store").size
            const totalChannelCount = textChannelCount + voiceChannelCount + newsChannelCount + storeChannelCount;
            const embed = new Discord.MessageEmbed()
            .setTitle(guild.name)
            .setColor("#FF003E")
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
            .setThumbnail(guild.iconURL({dynamic : true}))
            .addFields({
                name: "__Owner__",
                value: `> **Server nickname:** ${guild.member(owner.user).displayName}\n> **Tag:** ${owner.user.tag}`,
            },{
                name:"__Stats__",
                value:`> **User count:** ${guild.memberCount}\n> **Channel counts:**\n> *Total:* ${totalChannelCount}\n> *Categories:* ${categoryChannelCount}\n> - Text: ${textChannelCount}\n> - Voice: ${voiceChannelCount}\n> - News: ${newsChannelCount}\n> - Store: ${storeChannelCount}\n> **Server created:** ${guild.createdAt}`
            }, {
                name: "__Region__",
                value: `> ${guild.region}`,
            },{
                name: "Invite",
                value: `**Server invite link:** Not implemented yet`,
            });
            message.channel.send(embed);
        });
    }
}