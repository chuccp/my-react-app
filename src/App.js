import React from "react";
import logo from './logo.svg';
import './App.css';
import { Layout } from "antd";
const { Header, Footer, Sider, Content } = Layout;

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {versions:window.versions}
    }
  render() {
    return (
        <div className="App">
            <Layout>
                <Header>Header</Header>
                <Content>Content</Content>
            </Layout>
        </div>
    );
  }
}



export default App;
