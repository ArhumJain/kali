const Discord = require('discord.js');
const commandBase = require('../command-base');
module.exports = {
    commands: ['help'],
    minArgs: 0,
    maxArgs: 2,
    permissions: [],
    requiredRoles: [],
    callback: (message, arguments, text) =>{
        const color = "#FF003E";
        // Get custom prefix, if any, for server in which command was called
        const prefix = commandBase.getGuildPrefix(message.guild.id);
        if(arguments.length>0)
        {
            const embed = new Discord.MessageEmbed();
            switch(arguments[0])
            {
                // Category help for Utilities
                case 'utils':
                    message.channel.send("Utilities help");
                    embed.setTitle("Utlitiies Help")
                    .setColor(color)
                    .setFooter(`Help requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
                    .addFields({
                        name: "__Prefix Commands__",
                        value: `> - \`${prefix}prefix\`: Get the current prefix of the server\n> - \`${prefix}setprefix [prefix]\`: Set a custom prefix. Requires administrator permissions!`
                    }, {
                        name: "__Information Commands__",
                        value: `> - \`${prefix}userinfo [optional: @user]\`: Obtain information about a particular user. If\n> not specified, will default to your own user information.\n> - \`${prefix}serverinfo\`: Obtain information like stats about the server.\n> - \`${prefix}botinfo\`: Obtain information about Kali bot.`
                    }, {
                        name: "__Kick members__",
                        value: `> - \`${prefix}kick [@user] [reason]\`: Kick an existing member out of the server. They will,\n> however, be able to join back given the invite link!`,
                    })
                    message.channel.send(embed);
                    break;
                // Category help for moderation
                case 'mod':
                    embed.setTitle("Moderation Help")
                    .setColor(color)
                    .setFooter(`Moderation help requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
                    .setDescription("These commands require elevated user permissions. Standard server members will not be able to execute these commands!")
                    .addFields({
                        name: "__Ban members__",
                        value: `> - \`${prefix}ban [@user] [reason]\`: Members will **not** be able to join back unless you unban them!`
                    }, {
                        name: "__Unban members__",
                        value: `> - \`${prefix}unban [usertag]\`: Unban banned members.`
                    }, {
                        name: "__Kick members__",
                        value: `> - \`${prefix}kick [@user] [reason]\`: Kick an existing member out of the server. They \n> will, however, be able to join back given the invite link!`,
                    })
                    message.channel.send(embed);
                    break;
                // Category help for Kali Chatbot
                case 'chatbot':
                    embed.setTitle("Chatbot Help")
                    .setColor(color)
                    .setDescription("Kali can be a really fun bot to talk with. Try it out! She's fun, quirky, and might even surprise you every now and then! To start a conversation with her, you can use the commands below and start by saying 'Hi!' (Or whatever you want).")
                    .setFooter(`Chatbot help requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
                    .addFields({
                        name: "__Start chat__",
                        value: `>  - \`${prefix}startchat\`: Kali bot needs to power on her engine which gives it advanced intelligence!`
                    }, {
                        name: "__End chat__",
                        value: `> - \`${prefix}endchat\`: Shut down Kali bot's chat engine.`
                    }, {
                        name: "__Talk to the bot__",
                        value: `> - \`${prefix}tellbot [message]\`: Relay a conversational message to Kali so she can respond\n> to you!`,
                    })
                    message.channel.send(embed);
                    break;
                // Category help for code compiler
                case 'compile':
                    message.channel.send("Compiler help");
                    if(arguments[1] == "langs")
                    {
                        // Help embed for listing out all languages supported by the compiler (There are 37 in total)
                        embed.setTitle("__Supported Languages__")
                        .setColor(color)
                        .setDescription("A list of 30+ languages that Kali bot can compile!")
                        .setFooter(`List of supported languages requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
                        .addFields({
                           name: "A-L",
                           value:  `> Bash script: \`bash\`\n> C: \`c\`\n> C#: \`csharp\`\n> C++: \`cpp\`\n> CMake: \`cmake\`\n> CoffeeScript: \`cscript\`\n> Crystal: \`crystal\`\n> D: \`d\`\n> Elixir: \`elixir\`\n> F#: \`fsharp\`\n> Go: \`go\`\n> Groovy: \`groovy\`\n> Haskell: \`haskell\`
                           > Java: \`java\`\n> JavaScript: \`jscript\`\n> Lazy K: \`lazyk\`\n> Lisp: \`lisp\`\n> Lua: \`lua\``,
                           inline: true,
                        }, {
                            name: "M-Z",
                            // I found out >>> was a thing ;(
                            value: `>>> Nim: \`nim\`\n OCaml: \`ocaml\`\n OpenSSL: \`ossl\`\n PHP: \`php\`\n Pascal: \`pascal\`\n Perl: \`perl\`\n Pony: \`pony\`\n Python: \`python\`\n R: \`r\`\n Rill: \`rill\`\n Ruby: \`ruby\`\n Rust: \`rust\`\n SQL: \`sql\`
                            Scala: \`scala\`\n Swift: \`swift\`\n TypeScript: \`tscript\`\n Vim script: \`vscript\``,
                            inline: true,
                        })
                        message.channel.send("Supported languages")
                        message.channel.send(embed);
                        break;
                    }
                    embed.setTitle("Compiler Help")
                    .setColor(color)
                    .setFooter(`Compiler help requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
                    .setDescription("Instructions on how to use Kali's Code Compiler!")
                    .addFields({
                        name: "__Supported Languages__",
                        value: `- You can use \`${prefix}help compile langs\` to obtain a list of all supported languages that Kali can compile! (Your langauge is likely supported)`
                    }, {
                        name: "__Format__",
                        value: `- You must follow a specific format when it comes to sending code for Kali to compile:\n 1. First you must specify what language you want to compile using \`${prefix}compile [lang]\`\n2. You must then move to the next line in the **same** message and type out your code in a **code block**.\n
                        3. Example:\n > ${prefix}compile python\n> \`\`\`py\n> print("Hello World!")\n> \`\`\``
                    }, {
                        name: "__Output__",
                        value: `The compiler will give you an output with a status code of either \`0\` or \`1\`.\n**Note:** Compiler output is limited to 1000 characters so attempting to output the numbers from 1-1000 will only go up to about 277. There is also a strict timeout restriction of 3 seconds. If your code takes longer to compile, the compiler will exit!`,
                    })
                    message.channel.send(embed);
                    break;
                // Category for all commands that don't fit in above categories
                case 'misc':
                    message.channel.send("Miscellaneous help");
                    break;
                // If the category doesn't exist, default to this warn message
                default:
                    message.channel.send(`Invalid help category! Use \`${prefix}help\` for list of available help categories.`);
            }
        }
        else{
            // Send standard help embed with list of categories
            console.log(arguments.length);
            const embed = new Discord.MessageEmbed()
            .setTitle("Help Categories")
            .setColor(color)
            .setFooter(`Help requested by ${message.author.tag}`, message.author.avatarURL({dynamic : true}))
            .addFields({
                name: '__Utilities__',
                value: `> - \`${prefix}help utils\`: Get help on server commands regarding server utilities.`,
            }, {
                name: "__Moderation__",
                value: `> - \`${prefix}help mod\`: Moderation commands such as ban and kick.js`,
            }, {
                name: '__Code Compiler__',
                value: `> - \`${prefix}help compile\`: Kali bot can compile and run popular programming languages\n> **in discord**! Find out how to use this powerful functionality with this command.`,
            }, {
                name: '__Chatbot__',
                value: `> - \`${prefix}help chatbot\`: Kali bot comes equipped with an intelligent AI with which you\n> can hold coversations!`,
            }, {
                name: '__Miscellaneous__',
                value: `> - \`${prefix}help misc\`: Commands which dont fit into the categories listed above.`
            });
            message.reply("Helping you now!");
            message.channel.send(embed);
        }
    },
}