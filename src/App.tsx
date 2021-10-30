import React, { useState } from 'react'
import './App.css'
import Menu from './containers/Menu'
import Article from './containers/Article';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Menu} />
          <Route exact path="/article/:articleId" component={Article} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
