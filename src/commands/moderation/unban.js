const Discord = require('discord.js');
const client = require('../../index.js');
module.exports = {
    commands: ['unban'],
    expectedArgs: '[user]',
    minArgs: 1,
    permissions: ['ADMINISTRATOR', 'KICK_MEMBERS'],
    requiredRoles: [],
    callback: (message, arguments, text) =>{
        if(message.guild.member(client.user).hasPermission("BAN_MEMBERS"))
        {
            let targetId;
            let targetTag = arguments.join(" ");
            console.log(targetTag);
            // Obtain target user ID from tag as DiscordAPI only takes in ID as a parameter to unban users
            message.guild.fetchBans().then(bannedUsers => {
                targetId = bannedUsers.map(ban => {
                    console.log(ban.user.tag);
                    if (ban.user.tag == targetTag)
                    {
                        return ban.user.id;
                    }
                }).join('\n');
                if (targetId){
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Unban Successful")
                    .setColor("#FF003E")
                    .addFields({
                        name: `${targetTag}`,
                        value: "was unbanned!"
                    });
                    message.guild.members.unban(targetId);
                    message.channel.send(embed);
                }
                else{
                    message.channel.send(`<@${message.author.id}> Please specifiy a valid user **tag** (someuser#1234) to unban. Make sure the target is an already **banned** user.`);
                }

            });
        }
        else{
            message.reply("Kali does not have the required permissions in this server to execute this command :frown:")
        }
    } 
}