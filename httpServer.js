"use strict";
const express = require('express');
const fs = require("fs")
const path = require("path");
const http = require('http')
const cors = require('cors')
const queue = require('./queue')
class HttpServer {
    constructor() {
        this.app = express();
        this.queue = queue()
    }
    write(text){
        this.queue.write(text);
    }
    start(port = 9090,rootPath =__dirname ) {
        console.log(rootPath)
        this.port = port;
        console.log(`http server start listening on port ${this.port}`)
        this.app.use(cors())
        this.app.use(express.text())
        this.app.get('/', (req,res)=>{
            console.log("===============")
            res.send("hello world")
        });
        this.app.get('/player/static/js/debug.js', (req,res)=>{
            res.set("Content-Type","application/javascript; charset=UTF-8");
            const url = `window.debug_root_api  = "${req.protocol}://${req.get("Host")}";\n`;
            fs.readFile(path.join(rootPath,req.path),function (err,dataStr) {
               const buffer2 = Buffer.from(url);
                const buffer3 = Buffer.concat([buffer2,dataStr]);
                res.send(buffer3)
            })
        });
        this.app.post('/receiveLog', (req,res)=>{
            console.log(req.body)
            res.send("ok")

        });
        this.app.get('/sendCmd', (req,res)=>{
            this.queue.read(function (text) {
                res.send(text);
            })
        });

        this.app.all('/*.css',(req,res,next)=>{
            res.set("Content-Type","text/css; charset=UTF-8");
            fs.readFile(path.join(rootPath,req.path),function (err, data) {
                if(err){
                    next();
                }else{
                    res.send(data);
                }
            })
        })
        this.app.all('/*.html',(req,res,next)=>{
            res.set("Content-Type","text/html; charset=UTF-8");
            fs.readFile(path.join(rootPath,req.path),function (err, data) {
                if(err){
                    next();
                }else{
                    res.send(data);
                }
            })
        })
        this.app.all('/*.js',(req,res,next)=>{
            res.set("Content-Type","application/javascript");
            fs.readFile(path.join(rootPath,req.path),function (err, data) {
                if(err){
                    next();
                }else{
                    res.send(data);
                }
            })
        })

        this.app.all('/*',(req,res,next)=>{
            fs.readFile(path.join(rootPath,req.path),function (err, data) {
                if(err){
                    next();
                }else{
                    res.send(data);
                }
            })
        })

        // this.app.use(express.static(rootPath))

        this.server = http.createServer(this.app).listen(this.port,()=>{
            console.log(`http server start finish`)
        })
    }

    stop(){
        if(this.server){
            console.log(`http server closing`)
            this.server.close(()=>{
                console.log(`http server close finish`)
            })
        }
    }
}

const httpServer = new HttpServer();

exports.HttpServer = HttpServer;

exports.httpServer = httpServer;


