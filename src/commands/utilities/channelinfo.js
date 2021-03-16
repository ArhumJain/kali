const commandBase = require("../command-base");
const Discord = require('discord.js');
const client = require("../../index");
require('dotenv').config();
const bulletpoint = process.env.BULLETPOINTEMOJI
module.exports = {
    commands: ['channelinfo', 'ci'],
    minArgs: 1,
    expectedArgs: '[channel ID/#channel]',
    callback: async (message, arguments, text) => {
        const channelId = arguments[0].replaceAll(/@|<|>|#|&/g, "");
        const channel = message.guild.channels.cache.get(channelId);
        if(channel){
            let channelTag;
            const channelType = channel.type;
            if(channelType == "voice" || channelType == "category"){
                channelTag = channel.name.replaceAll(/<|>|#/g, "");
            }
            else {
                channelTag = `<#${channel.id}>`;
            }
            const embed = new Discord.MessageEmbed()
            .setTitle(`${channel.name} Channel`)
            .setColor("#FF003E")
            .setDescription(`${bulletpoint} **Name:** ${channelTag}\n${bulletpoint} **Type:** ${channel.type[0].toUpperCase() + channel.type.slice(1) + " Channel"}\n${bulletpoint} **Channel ID:** ${channel.id}\n${bulletpoint} **Created:** ${channel.createdAt}`);
            if(channel.type != "category")
            {
                embed.setFooter(`Category Name: ${channel.parent.name} • Category ID: ${channel.parentID}`)
            }
            message.channel.send(embed);
        }
        else {
            message.reply("Please specify a valid channel ID/#channel and make sure that it exists in this server");
        }
    }
}