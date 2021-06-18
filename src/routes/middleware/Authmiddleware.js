import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import routes from "../../helpers/routes.json";
import IdleTimerContainer from "../../components/Common/IdleTimeout";

const Authmiddleware = ({ component: Component, layout: Layout }) => (
  <Route
    render={(props) => {
      // here you can apply condition
      if (!localStorage.getItem("isAuth")) {
        return (
          <Redirect
            to={{ pathname: routes.login, state: { from: props.location } }}
          />
        );
      }
      return (
        <Layout>
          <Component {...props} />
          <IdleTimerContainer />
        </Layout>
      );
    }}
  />
);

export default withRouter(Authmiddleware);
