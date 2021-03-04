const Discord = require('discord.js');
const commandBase = require('../command-base');
const puppeteer = require('puppeteer');
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
        if(isChatStarted)
        {
            console.log(isChatStarted);
            message.channel.send("Chat ended!");
            // await page.screenshot({path: 'kukichat.png'});
            isChatStarted = false;
            console.log(isChatStarted);
            await browser.close();
        }
        else{
            message.channel.send(`A chat session has not been started. Use \`${prefix}startchat\` or \`${prefix}sc\` to get started!`)
        }
    },
}