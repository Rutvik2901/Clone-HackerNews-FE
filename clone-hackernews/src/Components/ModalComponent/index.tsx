import React, { Component } from "react";
import { Button, Form, Modal } from "semantic-ui-react";

interface ICreatePostModalState {
  openModal: boolean;
}
interface ICreatePostModalProps {
  onSubmit: () => void;
  content: string;
}

class ModalComponent extends Component<ICreatePostModalProps, ICreatePostModalState> {
  constructor(props: ICreatePostModalProps) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  private closeModal = () => {
    this.setState({ openModal: false });
  };
  private handleModal = () => {
    this.setState({ openModal: true });
  };

  private submitForm = () => {
    this.closeModal();
    this.props.onSubmit();
  };

  render() {
    const { openModal } = this.state;
    const { content } = this.props;

    return (
      <>
        <Button onClick={this.handleModal}>
          <Button.Content>{content}</Button.Content>
        </Button>
        <Modal dimmer="blurring" open={openModal} onClose={this.closeModal}>
          <Modal.Header>Enter Details</Modal.Header>
          <Modal.Content>
            <Form>{this.props.children}</Form>
          </Modal.Content>
          <Modal.Actions>
            <Button secondary onClick={this.closeModal}>
              Cancel
            </Button>
            <Button primary onClick={this.submitForm}>
              Submit
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default ModalComponent;
