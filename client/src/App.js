import "./App.css";
import Header from "./components/Header";
import Index from "./components/Index";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ShareMeme from "./components/ShareMeme";
import Item from "./components/Item";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/sharememe" component={ShareMeme} />
        <Route exact path="/items/:id" component={Item} />
      </Switch>
    </div>
  );
}

export default App;
