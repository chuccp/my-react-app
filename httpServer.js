"use strict";
const express = require('express');
const fs = require("fs")
const path = require("path");

class HttpServer {
    constructor(port = 9090) {
        this.app = express();
        this.app.use(express.text())
        this.port = port;
    }
    start() {
        console.log(`http server start listening on port ${this.port}`)
        this.app.get('/', (req,res)=>{
            console.log("===============")
            res.send("hello world")
        });

        this.app.get('/debug.js', (req,res)=>{
            res.set("Content-Type","application/javascript; charset=UTF-8");

            const url = `var debug_root_api  = "${req.protocol}://${req.get("Host")}";\n`;

            fs.readFile(path.join(__dirname, 'debug.js'),function (err,dataStr) {
               const buffer2 = Buffer.from(url);
                const buffer3 = Buffer.concat([buffer2,dataStr]);
                res.send(buffer3)
            })
        });

        this.app.post('/receiveLog', (req,res)=>{
            console.log(req.body)
            res.send("ok")

        });
        this.app.listen(this.port,()=>{
            console.log(`http server finish`)
        })
    }
}

const httpServer = new HttpServer();

exports.HttpServer = HttpServer;

exports.httpServer = httpServer;


