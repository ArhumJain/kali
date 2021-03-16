const commandBase = require("../command-base");
const Discord = require('discord.js');
const client = require("../../index");
require('dotenv').config();
const bulletpoint = process.env.BULLETPOINTEMOJI
module.exports = {
    commands: ['roleinfo', 'ri'],
    minArgs: 1,
    expectedArgs: '[role ID/@role]',
    callback: async (message, arguments, text) => {
        const roleId = arguments[0].replaceAll(/@|<|>|#|&/g, "")
        message.guild.roles.fetch(roleId).then((role) => {
            if(role){
                const embed = new Discord.MessageEmbed()
                .setTitle(`${role.name} Role`)
                .setColor(role.color)
                .setDescription(`${bulletpoint} **Name:** ${role.name}\n${bulletpoint} **Hex Color:** ${role.hexColor}\n${bulletpoint} **Role ID:** ${role.id}\n${bulletpoint} **Created:** ${role.createdAt}`);
                message.channel.send(embed);
            }
            else{
                message.reply("Please specify a valid role ID/#role and make sure that it exists in this server")
            }
            
        });
    }
}