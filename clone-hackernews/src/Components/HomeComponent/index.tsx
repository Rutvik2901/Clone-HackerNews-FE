import React, { Component } from "react";
import ContainerComponent from "../ContainerComponent";
import HeaderComponent from "../HeaderComponent";

interface IHomeComponentProps {}
interface IHomeComponentState {}

class HomeComponent extends Component<IHomeComponentProps, IHomeComponentState> {
  render() {
    return (
      <>
        <HeaderComponent />
        <ContainerComponent />
      </>
    );
  }
}

export default HomeComponent;
