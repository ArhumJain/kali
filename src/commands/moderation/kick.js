const Discord = require('discord.js');
module.exports = {
    commands: ['kick'],
    expectedArgs: '[user] [reason]',
    minArgs: 1,
    // permissions: ['ADMINISTRATOR', 'KICK_MEMBERS'],
    requiredRoles: [],
    callback: (message, arguments, text) =>{
        const target = message.mentions.users.first();
        if (target){
            const targetMember = message.guild.members.cache.get(target.id);
            const embed = new Discord.MessageEmbed()
            .setTitle("Member Kick Successful")
            .setColor("#FF003E")
            .setThumbnail(target.avatarURL())
            .addFields({
                name: targetMember.user.tag,
                value: `Reason: ${arguments.slice(1,arguments.length).join(' ')}`
            })
            targetMember.kick();
            message.channel.send(embed);
        }
        else{
            message.channel.send(`<@${message.author.id}> Please specifiy a valid user **tag** to kick. Make sure to @ the user.`);
        }
    } 
}