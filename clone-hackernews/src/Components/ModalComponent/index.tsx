import React, { Component } from "react";
import { Button, Form, Loader, Modal } from "semantic-ui-react";
import "Components/ModalComponent/Styles/index.css";
import store from "redux/store";
interface ICreatePostModalState {}
interface ICreatePostModalProps {
  onSubmit: () => void;
  open: boolean;
  modalClose: () => void;
  content: string;
  isModalPost: boolean;
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
    const { open, content, isModalPost, children } = this.props;

    return (
      <Modal id="modalBackground" dimmer="blurring" open={open} onClose={this.props.modalClose}>
        <Modal.Header id="headerColor">{content}</Modal.Header>
        <Modal.Content className="modalContent">
          <Form>{children}</Form>
        </Modal.Content>
        <Modal.Actions className="modalAction">
          <Button disabled={isModalPost} id="actionButtonsClose" onClick={this.props.modalClose}>
            Cancel
          </Button>
          <Button disabled={isModalPost} id="actionButtonsSubmit" onClick={this.submitForm}>
            {isModalPost ? <Loader size="tiny" inline="centered" /> : "Submit"}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ModalComponent;
