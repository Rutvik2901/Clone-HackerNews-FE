import React, { Component } from "react";
import ContainerComponent from "Components/ContainerComponent";
import HeaderComponent from "Components/HeaderComponent";

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
