const commandBase = require("../command-base");
const client = require("../../index");
const Discord = require('discord.js');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca({
    keyId: 'PKRXOSZAQJU93ZLZO5A4',
    secretKey: 'yr7EqF4PYZEJWCLij2nezFHHDyj3CDRC1158dmD7',
    paper: true,
    usePolygon: false
})
module.exports = {
    commands: ['stock'],
    minArgs: 1,
    expectedArgs: '[TICKER]',
    callback: async (message, arguments, text) => {
        const prefix = commandBase.getGuildPrefix(message.guild.id);
        const ticker = arguments[0].toUpperCase();
        message.react('821496104310931466');
        alpaca.getAsset(ticker).then((asset) => {
            alpaca.lastTrade(ticker).then((trade) => {
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`${asset.name}`)
                .setColor("FF003E")
                .setTimestamp()
                .setFooter(`${asset.symbol}`)
                .setDescription(`**Value:** ${trade.last.price}`)
                .addFields({
                    name: "__Exchange__",
                    value: `${asset.exchange}`
                })
                message.channel.send(embed);
                message.reactions.removeAll();
            }).catch((err) => {
                message.reply(`An unknwon error occurred! Please report the issue to one of support methods given in \`${prefix}botinfo\``);
                console.log(err);
                message.reactions.removeAll();
            })
        }).catch((err) => {
            message.reply("Please provide a valid ticker!");
            console.log(err);
            message.reactions.removeAll();
        });
        message.reactions.removeAll();
        return;
    }
}
