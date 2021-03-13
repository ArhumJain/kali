const { User } = require('discord.js');
const mongo = require('../mongo');
const prefixSchema = require("../schemas/server-settings");
require('dotenv').config();
const globalPrefix = process.env.PREFIX;
const guildPrefixes = {};
const validatePermissions = (permissions) =>{
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
      ]
      // Check if permissions passed are valid and supported permissions by Discord.
      for(const permission of permissions)
      {
          if(!validPermissions.includes(permission))
          {
              throw new Error(`Unknown permission node "${permission}"`);
          }
      }
}
module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You do not have sufficient permissions to run this command',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions;
    // Make sure command & aliases are in array
    if(typeof commands === "string"){
        commands = [commands];
    }
    // Check if is live
    console.log(`Registering command "${commands[0]}"`);
    // Make sure the permissions are in the array and are all valid permissions
    if(permissions.length){
        if(typeof permissions === 'string'){
            permissions = [permissions];
        }

        validatePermissions(permissions);
    }
    // Listen for messages
    client.on('message', message =>{
        const {member, content, guild} = message;
        const prefix = guildPrefixes[guild.id] || globalPrefix;       
        for (const alias of commands){
            if(content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)){
                // Run command
                // Makes sure user has required permissions
                for(const permission of permissions){
                    if(!member.hasPermission(permission)){
                        message.reply(permissionError);
                        return;
                    }
                }
                for(const requiredRole of requiredRoles){
                    const role = guild.roles.cache.find(role => role.name === requiredRole);
                    if(!role || member.roles.cache.has(role.id)){
                        message.reply(`You must have the "${requiredRole}" role to use this command.`)
                        return;
                    }
                }
                // Split on spaces to parse multiple arguments 
                const arguments = content.split(/[ ]+/);
                // Rmove the identifier command at first index
                arguments.shift();
                // Makse sure correct number of arguments
                if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs))
                {
                    message.reply(`Incorrect syntax! Use \`${prefix}${alias} ${expectedArgs}\``)
                    return;
                }
                // Handle the custom command code
                callback(message, arguments, arguments.join(' '));
                return;
            }
        }
        
    })
}
// mongo() connects to the MongoDB database and the following code loads in all custom prefixes set by all servers that have set a custom prefix
module.exports.loadPrefixes = async (client) =>{
    await mongo().then(async mongoose => {
        try {
            for(const guild of client.guilds.cache){
                const result = await prefixSchema.findOne({_id: guild[1].id});
                if(result == null)
                {
                    continue;
                }
                else{
                    guildPrefixes[guild[1].id] = result.prefix;
                }
            }
            console.log(guildPrefixes);
        }
        finally{
            mongoose.connection.close();
        }
    })
}
module.exports.updatePrefix = (guildId, newPrefix) =>{
    guildPrefixes[guildId] = newPrefix;
}

module.exports.getGuildPrefix = (guildId) =>{
    if(guildPrefixes.hasOwnProperty(guildId)){
        return guildPrefixes[guildId];
    }
    else{
        return globalPrefix;
    }
    
}