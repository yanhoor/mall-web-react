import React from 'react'
import * as Store from './store'
import { Provider } from 'mobx-react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { routes, RouterView, NoMatchRoute } from './router'
import './App.css'

function App() {
  return (
      <Provider {...Store}>
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
      </Provider>
  );
}

export default App;
