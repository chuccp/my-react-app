"use strict";
const express = require('express');
const fs = require("fs")
const path = require("path");
const http = require('http')
const cors = require('cors')
const queue = require('./queue')
const bodyParser = require('body-parser');
class HttpServer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json({limit: '5000mb'}));
        this.app.use(bodyParser.text({limit: '5000mb'}));
        this.app.use(bodyParser.raw({limit: '5000mb'}));
        this.app.use(bodyParser.urlencoded({limit: '5000mb', extended: true}));
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

        this.app.get('/player/xinjiang/xj_debug_*.js', (req,res)=>{
            console.log("远程调试启动中"+req.url)
            res.set("Content-Type","application/javascript; charset=UTF-8");
            const url = `window.debug_root_api  = "${req.protocol}://${req.get("Host")}";\n`;
            fs.readFile(path.join(rootPath,"/player/xinjiang/xj_debug.js"),function (err,dataStr) {
                const buffer2 = Buffer.from(url);
                const buffer3 = Buffer.concat([buffer2,dataStr]);
                res.send(buffer3)
            })
        });

        this.app.post('/receiveLog', (req,res)=>{
            console.log(req.body)

            if(req.body.length>2000){
                var  fileName = "/"+new Date().getTime()+".log";
                var filePath = path.join(rootPath,fileName)
                fs.writeFile(filePath,req.body,()=>{
                    console.log("保存文件"+filePath);
                })
            }



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


