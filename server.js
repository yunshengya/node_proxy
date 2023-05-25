const http = require('http');
const fs = require('fs');
http.createServer((req, res) => {
    if (req.url === '/') {
        // 如果请求根路径，返回 index.html 文件 
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'}); 
                res.end(data);
            }
         });
     } else if (req.url === '/events') {
         // 如果请求 /events 路径，建立 SSE 连接 
         res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }); 
         // 每隔 1 秒发送一条消息 
         let id = 0; 
         const intervalId = setInterval(() => { 
             res.write(`event: customEvent\n`)
             res.write(`id: ${id}\n`)
             res.write(`retry: 30000\n`)
             const data = { id, time: new Date().toISOString()}
             res.write(`data: ${JSON.stringify(data)}\n\n`); 
             id++
          }, 1000); 
          // 当客户端关闭连接时停止发送消息
          req.on('close', () => { 
              clearInterval(intervalId); 
              id = 0
              res.end();
          });
    } else { 
        // 如果请求的路径无效，返回 404 状态码 
        res.writeHead(404); 
        res.end();
    }
    
}).listen(3000); 

console.log('Server listening on port 3000'); 