import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { routes, RouterView, NoMatchRoute } from './router'
import './App.css'

function App() {
  return (
      <div className="App">
          <Router>
              <Switch>
                  {routes.map((route, i) => (
                      <RouterView key={i} {...route}/>
                  ))}

                  <Route path="*">
                      <NoMatchRoute />
                  </Route>
              </Switch>
          </Router>
      </div>
  )
}

export default App;
