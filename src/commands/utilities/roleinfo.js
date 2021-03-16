const commandBase = require("../command-base");
const Discord = require('discord.js');
const client = require("../../index");
module.exports = {
    commands: ['roleinfo', 'ri'],
    minArgs: 1,
    expectedArgs: '[role ID/@role]',
    callback: async (message, arguments, text) => {
        const roleId = arguments[0].replaceAll(/@|<|>|#|&/g, "")
        message.guild.roles.fetch(roleId).then((role) => {
            console.log(role.name);
            const embed = new Discord.MessageEmbed()
            .setTitle(`${role.name} Role`)
            .setColor(role.color)
            .setDescription(`**Name:** ${role.name}\n**Hex Color:** ${role.hexColor}\n**Role ID:** ${role.id}\n**Created:** ${role.createdAt}`);
            message.channel.send(embed);
        });
    }
}