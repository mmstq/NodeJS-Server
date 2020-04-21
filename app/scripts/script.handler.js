const httpCodes = require('http-status-codes');
const { spawn } = require('child_process');
const msg = require('../functions/notifier')
var list = []


exports.getNotice = async (req, res) => {
    var directory = __dirname + "/" + req.query.from + ".py"
    console.log(directory)
    // spawn new child process to call the python script
    const python = spawn(__dirname + '/env/bin/python3', [directory]);
    return new Promise((resolve, reject) => {
        var out = []
        python.stdout.on(
            'data',
            (data) => {
                out.push(data.toString());
                const jsonList = JSON.parse(data.toString())
                res.status(httpCodes.OK).send(jsonList)
                if (list.length == 0) {
                    list = jsonList
                } else {
                    for (var i = 0; i < 5; i++) {
                        if (list[i]['link'] != jsonList[i]['link']) {
                            msg.sendMsg(req.query.from.toUpperCase(), jsonList[i]['title'], jsonList[i]['link'])
                        }
                    }
                }
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
