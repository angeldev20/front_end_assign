/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  connect
} from 'react-redux';
// import { bindActionCreators } from 'redux';
import Layout from '../layouts/Full';
import Home from './Home';

class Main extends Component {
  componentWillMount() {
    fetch('http://localhost:2222/');
  }

  render() {
    return (
      <Layout>
        <Switch>
          <Route component={Home} path="/" />
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  // login: bindActionCreators(login, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
