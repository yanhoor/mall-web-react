import React from 'react'
import { HashRouter, Switch } from 'react-router-dom'
import { routes, RouterView } from './router'
import './App.css'

function App() {
  return (
      <div className="App">
          <HashRouter>
              <Switch>
                  {routes.map((route, i) => (
                      <RouterView key={i} {...route}/>
                  ))}
              </Switch>
          </HashRouter>
      </div>
  )
}

export default App;
