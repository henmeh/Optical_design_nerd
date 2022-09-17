import { Layout } from 'antd';
import 'antd/dist/antd.min.css';
import React from 'react';
import MenuItems from './components/MenuItems';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Glasselection from './components/glasselection/glasselection';

const { Header } = Layout;

const styles = {
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
  },
}

function App() {
  return (
    <Layout
    style={{
      height: "100vh",
      overflow: "auto",
      background: "#f0f0f5",
    }}>
    <Router>
      <Header>
        <MenuItems/>
      </Header>
      <div style={styles.content}>
        <Switch>
          <Route path="/glasselection">
            <Glasselection/>
          </Route>
          <Route path="/">
            <Redirect to="/glasselection"/>
          </Route>
        </Switch>
      </div>
    </Router>
  </Layout>
  );
}

export default App;
