import React, { Component } from "react";
import { Message } from "semantic-ui-react";
import "Components/MessageComponent/styles/index.css";

interface IMessageComponentProps {
  messageHeader: string;
  messageBody: string;
  onDismiss: () => void;
}
interface IMessageComponentState {}

class MessageComponent extends Component<IMessageComponentProps, IMessageComponentState> {
  constructor(props: IMessageComponentProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { messageHeader, messageBody } = this.props;
    return (
      <Message id="message" negative onDismiss={this.props.onDismiss}>
        <Message.Header>{messageHeader}</Message.Header>
        <p>{messageBody}</p>
      </Message>
    );
  }
}
export default MessageComponent;
