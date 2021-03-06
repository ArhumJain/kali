const commandBase = require("../command-base");
const Discord = require('discord.js');
const client = require("../../index");
require('dotenv').config();
const bulletpoint = process.env.BULLETPOINTEMOJI
module.exports = {
    commands: ['userinfo', 'ui'],
    minArgs: 0,
    maxArgs: 1,
    callback: async (message, arguments, text) => {
        // Get tagged argument to get info on another user in the server
        const target = message.mentions.users.first();
        // Variable for user object
        let user;
        // Variable for GuilMember object (Need this for stuff like displayName and joinedAt)
        let userMember;
        // Variable to store a list of formatted roles a user has
        let roles = "";
        // Checks if target is not undefined meaning the user did not specify another user to get userinfo on. This will else default into userinfo for self
        if(target != undefined){
            user = client.users.cache.get(target.id);
            userMember = message.guild.member(user);
        }
        else{
            user = message.author;
            userMember = message.guild.member(user);
        }
        const rolesCache = userMember.roles.cache.array()
        for(const role of rolesCache){
            if(role.name != "@everyone")
            {
                roles += `<@&${role.id}>`
            }
        }
        if(roles.length == 0){
            roles = "No roles for this server"
        }
        const embed = new Discord.MessageEmbed()
        .setTitle(userMember.displayName)
        .setColor("#FF003E")
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
        .setThumbnail(user.avatarURL({dynamic : true}))
        .addFields({
            name:"__Identification__",
            value:`${bulletpoint} **User tag:** ${user.tag}\n${bulletpoint} **Server nickname:** ${userMember.displayName}\n${bulletpoint} **Number ID:** ${user.id}\n${bulletpoint} **Bot:** ${user.bot}`
        }, {
            name: "__Join Dates__",
            value: `${bulletpoint} **Joined Discord:** ${user.createdAt}\n${bulletpoint} **Joined Server:** ${userMember.joinedAt}`,
        }, {
            name: "__Server Roles__",
            value: roles,
        });
        message.channel.send(embed);
    }
}