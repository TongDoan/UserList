import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import AppHeader from "../AppHeader/AppHeader";

import Users from "../../../Modules/Org/Components/Users/Users";
class App extends React.Component<any, any> {
  render() {
    const { path } = this.props.match;
    return (
      <div className="App">
        <AppHeader></AppHeader>
        <Switch>
          <Route path={`${path}/users`} component={Users} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
