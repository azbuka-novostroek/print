const net = require('net');
const puppeteer = require('puppeteer-core');
const uuid = require('uuid');
const port = 3001;

puppeteer
    .launch({executablePath: '/usr/bin/chromium-browser'})
    .then(browser => {
        const server = net.createServer((socket) => {
            console.log('server created');

            socket.on('data', (data) => {
                const json = JSON.parse(data.toString());

                if (!json.html) {
                    console.log('No html in data');
                    socket.write('Not Html \n');
                    socket.pipe(socket);
                    socket.end();
                    return ;
                }

                (async () => {
                    const filename = '/files/' + uuid.v4() + '.pdf';
                    const path = __dirname + filename;
                    const page = await browser.newPage();
                    await page.setContent(json.html);
                    await page.pdf({path: path});

                    console.log('pdf created', path);

                    socket.write(path + '\n');
                    socket.pipe(socket);
                    socket.end();
                })();
            });

            socket.on('end', () => {
                console.log('client disconnected');
            });
        });

        server.listen(port, () => {
            console.log(`3001 socket port`);
        });
    });
