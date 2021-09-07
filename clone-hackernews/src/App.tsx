import React from "react";
// import { Route, BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import "App.css";
import CommentComponent from "Components/CommentComponent";
import HomeComponent from "Components/HomeComponent";

function App() {
  return (
    <div className="App">
      <HomeComponent />
      {/* <BrowserRouter> */}
      {/* <Route exact path="/" component={HomeComponent} /> */}
      {/* <Route exact path="/comment/post/:id" render={(props) => <CommentComponent {...props} id={props.match.params.id} />} /> */}
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
