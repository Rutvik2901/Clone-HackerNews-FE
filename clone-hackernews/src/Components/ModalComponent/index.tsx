import React, { Component } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import "Components/ModalComponent/Styles/index.css";
interface ICreatePostModalState {}
interface ICreatePostModalProps {
  onSubmit: () => void;
  open: boolean;
  modalClose: () => void;
  content: string;
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
    const { open, content } = this.props;

    return (
      <Modal id="modalBackground" dimmer="blurring" open={open} onClose={this.props.modalClose}>
        <Modal.Header id="headerColor">{content}</Modal.Header>
        <Modal.Content className="modalContent">
          <Form>{this.props.children}</Form>
        </Modal.Content>
        <Modal.Actions className="modalAction">
          <Button id="actionButtonsClose" onClick={this.props.modalClose}>
            Cancel
          </Button>
          <Button id="actionButtonsSubmit" onClick={this.submitForm}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ModalComponent;
