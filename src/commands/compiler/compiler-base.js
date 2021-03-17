const request = require('request');
module.exports = (code, compiler) => {
    // While code is compiled and bot wait for response from API, this allows othere commands to be executed as well as other compiles to be started as well
    return new Promise((output) => {
        // Init data to for POST to Wandbox API
        const postData = {
            'code': code,
            'compiler': compiler,
        }
        // Wandbox API requires "application/json" content type and also setting json header to postData
        const options = {
            json: postData,
            timeout: 2000,
            headers: {
                "Content-Type": "application/json",
            }
        }
        // Make the final POST to the WandboxAPI
        request.post('https://wandbox.org/api/compile.json', options, (err, res, body) => {
            if (err) {
                // console.error(err);
                output(err);
                return err;
            }
            console.log(body);
            output(body);
        })
    }
)}
