import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header.tsx";
import Home from "./Routes/Home.tsx";
import Search from "./Routes/Search.tsx";
import Tv from "./Routes/Tv.tsx";
import React from "react";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
 
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
        <Route path="/Tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;