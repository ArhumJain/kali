const commandBase = require('../command-base');
const puppeteer = require('puppeteer');
const Discord = require('discord.js');
const prefix = commandBase.getGuildPrefix();
// Import the compiler base. We have exported a function which returns a Promise in the command-base.js file and this can be called using compiler() with the required args
const compiler = require('./compiler-base');
let supportedLangs = {
    
    "python": "cpython-head",
    "csharp": "mcs-head",
    "cplus": "gcc-head",
    "jscript": "nodejs-head",
    "java": "openjdk-head",
    "bash": "bash",
    "c":"clang-head",
    "cmake":"cmake-head",
    "cscript":"coffeescript-head",
    "crystal":"crystal-head",
    "d":"dmd-head",
    "elixir":"elixir-head",
    "fsharp":"fsharp-head",
    "go":"go-head",
    "groovy":"groovy-head",
    "haskell":"ghc-head",
    "lazyk":"lazyk",
    "lisp":"sbcl-head",
    "lua":"lua-5.4.0",
    "nim":"nim-head",
    "ocaml":"ocaml-head",
    "ossl":"openssl-head",
    "php":"php-head",
    "pascal":"fpc-head",
    "perl":"perl-head",
    "pony":"pony-head",
    "r":"r-3.5.1",
    "rill":"rill-head",
    "ruby":"ruby-head",
    "rust":"rust-head",
    "sql":"sqlite-head",
    "scala":"scala-2.13.x",
    "swift":"swift-head",
    "tscript":"typescript-3.9.5",
    "vscript":"vim-head",
    
}
// Process message sent by user and turn it into code that can be send to the compiler
const userInputParser = (text) =>{
    let codeSentByUser = text.split(/```(\w*)/);
    let language = codeSentByUser[0].split("\n")[0].trim();
    codeSentByUser.shift();
    codeSentByUser.shift();
    codeSentByUser.pop();
    codeSentByUser.pop();
    return {codeSentByUser, language};

}
// Returns a bool depending on whether or not the language passed by the user is a supported language. Refer to the supportedLangs object for all supported languages
const isSupportedLanguage = (language) =>{
    console.log(language);
    return supportedLangs.hasOwnProperty(language);
}
module.exports = {
    commands: ['compile', 'cp'],
    minArgs: 1,
    maxArgs: null,
    expectedArgs: '[code]',
    permissions: [],
    requiredRoles: [],
    callback: async (message, arguments, text) =>{
        if(message.author.id != 816116634162167818){
            const {codeSentByUser, language} = userInputParser(text);
            if (codeSentByUser.length == 0)
            {
                message.reply("Please send a valid code block!");
                return;
            }
            if(isSupportedLanguage(language))
            {
                const compilerOutputEmbed = new Discord.MessageEmbed(); // Initialize embed object will be use to send the results of the compile to the user
                const selectedLanguage = supportedLangs[language];
                // Call the compiler base and pass in the users' code and the selected language (compiler, e.g. cypthon-head)
                compiler(codeSentByUser[0], selectedLanguage).then((compilerOutput) => {
                    // Extract fields from compilerOutput
                    const statusCode = compilerOutput.status;
                    let finalOutput = (compilerOutput.program_error !== undefined) ? compilerOutput.program_error : compilerOutput.program_output; // Check if the compilerOutput isn't false. It would be false if another compile was currently in progress (Refer to the compile() function)
                    // If the program execution failed, this runs, otherwise we send a normal success embed
                    if(statusCode != "0"){
                        compilerOutputEmbed
                        .setTitle("Compile failed!")
                        .setFooter(`Kali Compiler: Use \`${prefix}compile slang\` for list of supported languages`)
                        .setColor("#ff7e70")
                        .addFields({
                            name: "__Output__",
                            value: "```" + "\n" + finalOutput + "\n" + "```",
                        }, {
                            name: "__Status__",
                            value: `Exited with status code **${statusCode}**`
                        });
                        message.channel.send(compilerOutputEmbed);
                    }
                    else{
                        if(finalOutput.length > 1000){ // Discord API prevents you from sending over 1024 characters in an embed. 1000 characters has been chosen as a padding in this scenario
                            console.log("Compiler output is greater 1024 characters");
                            finalOutput = finalOutput.substring(0,1000);
                        }
                        compilerOutputEmbed
                        .setTitle("Compile success!")
                        .setFooter(`Kali Compiler: Use \`${prefix}help compile langs\` for list of supported languages`)
                        .setColor("#70ff96")
                        .addFields({
                            name: "__Output__",
                            value: "```" + "\n" + finalOutput + "\n" + "```",
                        }, {
                            name: "__Status__",
                            value: "Exited with status code 0!"
                        });
                        message.channel.send(compilerOutputEmbed);   
                    }
                });   
            }
            else{
                message.reply("That is not a supported language!");
            }
        }
    },
}
