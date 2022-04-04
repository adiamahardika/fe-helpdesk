import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class NonAuthLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = "Myg Ticketing";
  }
  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

export default withRouter(NonAuthLayout);
