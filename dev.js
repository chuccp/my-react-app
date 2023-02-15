#!/usr/bin/env node
"use strict";
console.log("开始执行")
const concurrently = require('concurrently');
const { Writable } = require('stream');
const dotenv = require("dotenv")
dotenv.config()
let hasStartElectron = false
const myStream = new Writable({decodeStrings: false,
    write(chunk, encoding, callback) {
       process.stdout.write(chunk);
       if(chunk.match(new RegExp(`http://${process.env.HOST}.{1,5}${process.env.PORT}`))){
           if(!hasStartElectron){
               hasStartElectron = true
               setTimeout(startElectron,200)
           }
       }
        callback()
    }
});
const reactExec = concurrently([{command: 'SET NODE_OPTIONS=--openssl-legacy-provider && react-scripts start'}],{outputStream:myStream})
function startElectron() {
    const {result} = concurrently(['electron .'],{outputStream:process.stdout})
    result.then(()=>{
        reactExec.commands[0].kill()
        console.log("执行完成")
    })
}