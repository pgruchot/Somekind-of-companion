import React from 'react';
import { Route } from 'react-router-dom'

import Profile from './Components/Profile';
import MembershipContextProvider from './Contexts/MembershipContext';
import AuthContextProvider from './Contexts/AuthContext';
import Characters from './Components/Characters';
import Stats from './Components/Stats';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import SelectPlatformComponent from './Components/SelectPlatformComponent'
import SelectCharacterComponent from './Components/SelectCharacterComponent'
import Games from './Components/Games'

export default function App() {
  return (
    <div>
      <img className="background" src={require("./img/traveler.png")} alt=""></img>
      <MembershipContextProvider>
        <AuthContextProvider>  
          <Route exact path='/' render={props =>
            <Home/>
          }/>
          <Route exact path="/search/:platform/:guardian"  render={props =>
            <div className="background-cover">
              <Profile {...props}/>
              <div className="bottom-container">
                <Characters/>
                <Stats/>
              </div>
            </div>
          }/>
          <Route exact path="/dashboard" render={props =>    
            <div className="background-cover">
              <Dashboard/>
              <div className="bottom-container">
                <SelectPlatformComponent/>
                <SelectCharacterComponent/>
                <Characters/>
                <Stats/>
                <Games mode={70} modeName={"Quickplay"}/>
                <Games mode={37} modeName={"Glory"}/>
              </div>
            </div>
      }/>
        </AuthContextProvider>
      </MembershipContextProvider>
    </div>
  );
}


