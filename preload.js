const { contextBridge,ipcRenderer  } = require('electron')
contextBridge.exposeInMainWorld('httpServer', {
    start:(port,path)=>ipcRenderer.invoke('start',port,path),
    stop:()=>ipcRenderer.invoke('stop'),
    write:(text)=>ipcRenderer.invoke('write',text),
})