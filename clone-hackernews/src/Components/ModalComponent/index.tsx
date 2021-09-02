import React, { Component } from "react";
import { Button, Form, Modal } from "semantic-ui-react";

interface ICreatePostModalState {}
interface ICreatePostModalProps {
  onSubmit: () => void;
  open: boolean;
  modalClose: () => void;
}

class ModalComponent extends Component<ICreatePostModalProps, ICreatePostModalState> {
  constructor(props: ICreatePostModalProps) {
    super(props);
    this.state = {};
  }

  private submitForm = () => {
    this.props.onSubmit();
  };

  render() {
    const { open } = this.props;

    return (
      <>
        <Modal dimmer="blurring" open={open} onClose={this.props.modalClose}>
          <Modal.Header>Enter Details</Modal.Header>
          <Modal.Content>
            <Form>{this.props.children}</Form>
          </Modal.Content>
          <Modal.Actions>
            <Button secondary onClick={this.props.modalClose}>
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
