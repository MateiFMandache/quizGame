const http = require("http");
const fs = require("fs");
const PORT = 3210;
"use strict";

http.createServer((req, res) => {
  if (req.method == "GET") {
    const file = req.url.slice(1);
    fs.readFile((error, data) => {
      if (error) {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("Resource not found")
        res.end()
      } else {
        const extension = req.url.split(".")[1];
        switch (extension) {
          case "html":
            res.writeHead(200, {"Content-Type": "text/html"});
            break;
          case "ico":
            res.writeHead(200, {"Content-Type": "image/x-icon"});
            break;
          case "js":
            res.writeHead(200, {"Content-Type": "application/javascript"});
            break;
          case "css":
            res.writeHead(200, {"Content-Type": "text/css"});
            break;
          default:
            res.writeHead(200, {"Content-Type": "text/plain"});
        }
        res.write(data);
        res.end();
      }
    });
  }
}).listen(PORT);
