const Discord = require('discord.js');
module.exports = {
    commands: ['ban'],
    expectedArgs: '[user] [reason]',
    minArgs: 1,
    permissions: ['ADMINISTRATOR', 'KICK_MEMBERS'],
    requiredRoles: [],
    callback: (message, arguments, text) =>{
        const target = message.mentions.users.first();
        // Checks if a target is a valid user in in the server --> If not sends a warning message
        if (target){
            const targetMember = message.guild.members.cache.get(target.id);
            const embed = new Discord.MessageEmbed()
            .setTitle("Member Ban Successful")
            .setColor("#FF003E")
            .addFields({
                name: targetMember.user.tag,
                value: `Reason: ${arguments.slice(1,arguments.length).join(' ')}`
            })
            targetMember.ban();
            message.channel.send(embed);
        }
        else{
            message.channel.send(`<@${message.author.id}> Please specifiy a valid user to ban. Make sure to @ tag the offender!`);
        }
    } 
}