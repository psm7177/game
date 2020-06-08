import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css'

import Home from './Home';
import Game from './Game';
import Room from './Room';

function App() {

  useEffect(()=>{
  },[]);

  return (
    <Router style={{backgroundColor:"#f0f2f5"}}>
        <Switch>
          <Route path="/game/:id" component={Game}/>
          <Route path="/room" component={Room}/>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
