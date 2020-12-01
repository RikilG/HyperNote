// wait-for-react.js
const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();
const npm = (process.platform === "win32" ? "npm.cmd" : "npm");

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('Starting electron');
            startedElectron = true;
            // const exec = require('child_process').exec;
            // exec('npm run electron');
            const spawn = require('child_process').spawn;
            const electronProcess = spawn(npm, ["run", "electron"])

            electronProcess.stdout.on('data', function(data) {
                console.log('stdout: ' + data.toString());
            });
            
            electronProcess.stderr.on('data', function(data) {
                console.log('stderr: ' + data.toString());
            });
            
            electronProcess.on('exit', function(code) {
                console.log('Electron exited with code: ' + code.toString());
            });
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1500);
});