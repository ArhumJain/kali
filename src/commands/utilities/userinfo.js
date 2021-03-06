const commandBase = require("../command-base");
const Discord = require('discord.js');
const client = require("../../index");
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
        // Checks if target is not undefined meaning the user did not specify another user to get userinfo on. This will else default into userinfo for self
        if(target != undefined){
            user = client.users.cache.get(target.id);
            userMember = message.guild.member(user);
        }
        else{
            user = message.author;
            userMember = message.guild.member(user);
        }
        const embed = new Discord.MessageEmbed()
        .setTitle(userMember.displayName)
        .setColor("#FF003E")
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
        .setThumbnail(user.avatarURL({dynamic : true}))
        .addFields({
            name: "__Join Dates__",
            value: `> **Joined Discord:** ${user.createdAt}\n> **Joined Server:** ${userMember.joinedAt}`,
        },{
            name:"__Identification__",
            value:`> **Number ID:** ${user.id}\n> **User tag:** ${user.tag}\n> **Server nickname:** ${userMember.displayName}`
        });
        message.channel.send(embed);
    }
}