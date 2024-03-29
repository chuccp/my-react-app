const { app, BrowserWindow,Menu,ipcMain  } = require('electron')
const path = require('path')
const dotenv = require("dotenv")
const {httpServer}  = require("./httpServer")
dotenv.config()
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    if(app.isPackaged){
        win.loadFile('index.html').then(r => {})
    }else{
        win.loadURL(`http://${process.env.HOST}:${process.env.PORT}`).then(r => {})
    }
    const template = [
        {
            label: '刷新', role: 'reload'
        },{
            label: '调试', role: 'toggleDevTools'
        }
    ]
  const menu =  Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    ipcMain.handle('start',(ev,port,path)=>{
        httpServer.start(port,path);
    })
    ipcMain.handle('stop',()=>{
        httpServer.stop();
    })
    ipcMain.handle('write',(ev,text)=>{
        httpServer.write(text);
    })
}

app.whenReady().then(() => {
    createWindow();

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})