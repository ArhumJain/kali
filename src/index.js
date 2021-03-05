const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const mongo = require('./mongo');
require('dotenv').config();
client.on('ready', () =>{
    console.log(`Client ready! Logged in as ${client.user.tag}!`);
    client.user.setActivity("your every move...", {type:"WATCHING"});
    const baseFile = 'command-base.js';
    const commandBase = require(`./commands/${baseFile}`);
    commandBase.loadPrefixes(client);
    // Function to process all existing commands and initialize them for use
    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if(stat.isDirectory()) {
                readCommands(path.join(dir, file));
            }
            else if(file !== baseFile) {
                const option = require(path.join(__dirname, dir, file));
                commandBase(client, option);
            }
        }
    }
    readCommands('commands');
})
// Allow other commands and files to access the client if it is needed
module.exports = client;
client.login(process.env.TOKEN);