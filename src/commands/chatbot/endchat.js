const Discord = require('discord.js');
const commandBase = require('../command-base');
const puppeteer = require('puppeteer');
// So we can access public methods and reference public variables from startchat.js
const startChat = require('./startchat');
const prefix = commandBase.getGuildPrefix();
module.exports = {
    commands: ['endchat', 'ec'],
    minArgs: 0,
    permissions: [],
    requiredRoles: [],
    callback: async (message, arguments, text) =>{
        const browser = startChat.getBrowser();
        const page = startChat.getPage();
        let isChatStarted = startChat.getChatStarted();
        // Check if browser already open, if it is, we can shut it down
        if(isChatStarted)
        {
            message.channel.send("Chat ended!");
            startChat.setChatStarted(false);
            await browser.close();
        }
        else{
            message.channel.send(`A chat session has not been started. Use \`${prefix}startchat\` or \`${prefix}sc\` to get started!`)
        }
    },
}