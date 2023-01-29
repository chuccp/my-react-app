import React, {useState} from "react";
import './App.css';
import {Card, Input,Button} from "antd";
import {count} from "rxjs";


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {port:9090,path:"C:\\Users\\cao\\Documents\\svn"};
        this.startServer = this.startServer.bind(this);
        this.stopServer = this.stopServer.bind(this);
        this.onChangePort = this.onChangePort.bind(this);
    }
  render() {
    return (
        <div className="App">
            <Card style={{height:'100%'}} title={this.inputServe()} bordered={false} headStyle={{height:'60px'}} bodyStyle={{height: 'calc(100% - 60px)'}} >
                {this.logShow()}
            </Card>
        </div>
    );
  }

  logShow(){
        return   <Input.Group  style={{height:'100%'}} compact>
            <Input.TextArea  style={{height: 'calc(100% - 30px)',resize:"none"}} placeholder="日志显示" autoSize={false}></Input.TextArea>
            <Input  style={{ width:  'calc(100% - 80px)',marginTop:"10px" }} placeholder="命令窗口" defaultValue="" />
            <Button style={{ width:  '80px',marginTop:"10px" }} onClick={this.write} type="success">发送</Button>
        </Input.Group>
  }

  inputServe(){
      return <Input.Group >
          <Input style={{ width: '100px' }} placeholder="端口号" defaultValue={this.state.port} onChange={this.onChangePort}  />
            <Input style={{width: 'calc(100% - 300px)'}} placeholder="请输入路径" defaultValue={this.state.path} />
            <Button onClick={this.startServer} type="primary">启动服务</Button>
            <Button onClick={this.stopServer} type="success">关闭</Button>
        </Input.Group>
  }
  startServer(){
        window.httpServer.start(this.state.port,this.state.path);
  }
    onChangePort(event){
        this.setState({port: event.target.value});
    }
    onChangePath(event){
        this.setState({path: event.target.value});
    }
    stopServer(e){
        window.httpServer.stop();
    }
    write(){
        window.httpServer.write("!!!!!!!!");
    }

}



export default App;
