const Discord = require('discord.js');
const commandBase = require('../command-base');
module.exports = {
    commands: ['help'],
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    callback: (message, arguments, text) =>{
        const color = "#FF003E";
        const prefix = commandBase.getGuildPrefix(message.guild.id);
        if(arguments.length>0)
        {
            const embed = new Discord.MessageEmbed();
            switch(arguments[0])
            {
                case 'utils':
                    message.channel.send("Utilities help");
                    break;
                case 'mod':
                    embed.setTitle("Moderation Help")
                    .setColor(color)
                    .setFooter("User requires elevated server permissions to use these commands")
                    .addFields({
                        name: "__Ban members__",
                        value: `- \`${prefix}ban [@user] [reason]\`: Members will **not** be able to join back unless you unban them!`
                    }, {
                        name: "__Unban members__",
                        value: `- \`${prefix}unban [usertag]\`: Unban banned members.`
                    }, {
                        name: "__Kick members__",
                        value: `- \`${prefix}kick [@user] [reason]\`: Kick an existing member out of the server. They will, however, be able to join back given the invite link!`,
                    })
                    message.channel.send(embed);
                    break;
                case 'chatbot':
                    embed.setTitle("Chatbot Help")
                    .setColor(color)
                    .addFields({
                        name: "__Start chat__",
                        value: `- \`${prefix}startchat\`: Kali bot needs to power on it's engine which give it advanced intelligence!`
                    }, {
                        name: "__End chat__",
                        value: `- \`${prefix}endchat\`: Shut down Kali bot's chat engine.`
                    }, {
                        name: "__Talk to the bot__",
                        value: `- \`${prefix}tellbot [message]\`: Relay a conversational message to Kali so she can respond to you!`,
                    })
                    message.channel.send(embed);
                    break;
                case 'misc':
                    message.channel.send("Miscellaneous help");
                    break;
                default:
                    message.channel.send(`Invalid help category! Use \`${prefix}help\` for list of available help categories.`);
            }
        }
        else{
            console.log(arguments.length);
            const embed = new Discord.MessageEmbed()
            .setTitle("Help Categories")
            .setColor(color)
            .setFooter("help categories")
            .addFields({
                name: '__Utilities__',
                value: `- \`${prefix}help utils\`: Get help on server commands regarding server utilities.`,
            }, {
                name: "__Moderation__",
                value: `- \`${prefix}help mod\`: Moderation commands such as ban and kick.js`,
            }, {
                name: '__Code Compiler__',
                value: `- \`${prefix}help compile\`: Kali bot can compile and run popular programming languages **in discord**! Find out how to use this powerful functionality with this command.`,
            }, {
                name: '__Chatbot__',
                value: `- \`${prefix}help chatbot\`: Kali bot comes equipped with an intelligent AI with which you can hold coversations!`,
            }, {
                name: '__Miscellaneous__',
                value: `- \`${prefix}help misc\`: Commands which dont fit into the categories listed above.`
            });
            message.reply("Helping you now!");
            message.channel.send(embed);
        }
    },
}