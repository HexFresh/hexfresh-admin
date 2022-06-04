import React from "react";
import {Button} from "antd";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    console.log(error);
    return {hasError: true};
  }

  handleErrorClick = () => {
    this.setState({hasError: false});
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');

    window.location.reload();
  }

  componentDidCatch(error, errorInfo) {
    console.log(error);
    console.log(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (<>
        <h1>Some thing went wrong</h1>
        <Button onClick={this.handleErrorClick}>Handle Error</Button>
      </>);
    }
    return this.props.children;
  }
}
