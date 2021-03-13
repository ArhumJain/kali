const mongo = require('../mongo');
const logsEnabledSchema = require("../schemas/server-settings");
const enabledServers = {};
// const logsEnabledSchema = require()
require('dotenv').config();


module.exports = (client) =>{

}

module.exports.loadLogSettings = async (client) =>{
    await mongo().then(async mongoose => {
        try {
            for(const guild of client.guilds.cache){
                const result = await prefixSchema.findOne({_id: guild[1].id});
                if (result == null) {
                    continue;
                }
                else{
                    enabledServers[guild[1].id] = result.isLogsEnabled;
                }
            }
            console.log(enabledServers);
        }
        finally {
            mongoose.connection.close();
        }
    })
}