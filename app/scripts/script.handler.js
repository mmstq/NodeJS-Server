const httpCodes = require('http-status-codes');
const { spawn } = require('child_process');
const msg = require('../functions/notifier')


exports.getNotice = async (req, res) => {
    var directory = __dirname +"/"+ req.query.from+".py"
    console.log(directory)
    // spawn new child process to call the python script
    const python = spawn(__dirname + '/env/bin/python3', [directory]);
    return new Promise((resolve, reject) => {
        var out = []
        python.stdout.on(
            'data',
            (data) => {
                out.push(data.toString());
                res.status(httpCodes.OK).send(data.toString())
                console.log(data[0].toString())
            }
        );
        var err = []
        python.stderr.on(
            'data',
            (data) => {
                err.push(data.toString())
            }
        );
        python.on('exit', (code, signal) => {
            if (code !== 0) {
                reject(new Error(err.join('\n')))
                return
            }
            try {
                resolve(JSON.parse(out[0]));
            } catch (e) {
                reject(e);
            }
        });
    }).catch(error => {
        console.log(`error catch is : ${error}`)
    })
}
