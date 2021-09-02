import { debounce, toLower } from "lodash";
import React, { Component } from "react";
import { Button, Form, Grid, Search } from "semantic-ui-react";
import { baseUrl } from "Constants/baseUrl";
import PostModel from "Constants/Models/PostModel";
import { addPosts, doneSearch, postSearch } from "redux/actions";
import store from "redux/store";
import ModalComponent from "Components/ModalComponent";
import "Components/HeaderComponent/styles/index.css";

interface IHeaderComponentProps {}
interface IHeaderComponentState {
  loading: boolean;
  postModel: PostModel;
  modal: boolean;
}

class HeaderComponent extends Component<IHeaderComponentProps, IHeaderComponentState> {
  constructor(props: IHeaderComponentProps) {
    super(props);
    this.state = {
      loading: false,
      postModel: { title: "", description: "", author: "", url: "", votes: 0 },
      modal: false,
    };
  }

  componentDidMount() {
    store.subscribe(this.searchLoading);
  }

  searchLoading = () => {
    this.setState({
      loading: store.getState().loading,
    });
  };

  private onSubmit = () => {
    const { postModel } = this.state;
    if (postModel.author.length === 0) {
      postModel.author = "Annonymous";
    }
    fetch(baseUrl + "/post", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postModel),
    }).then(() => {
      fetch(baseUrl + "/post")
        .then((res) => res.json())
        .then((res) => {
          store.dispatch(addPosts(res));
          this.closeModal();
        });
    });
  };

  private searchPaginated = debounce((params: string) => {
    fetch(baseUrl + "/post?search=" + toLower(params))
      .then((res) => res.json())
      .then((res) => {
        store.dispatch(doneSearch());
        store.dispatch(addPosts(res));
      });
  }, 500);

  public searchFields = (data: any) => {
    store.dispatch(postSearch());
    this.searchPaginated(data.value);
  };

  handleValueChange = (event: any) => {
    this.setState({
      postModel: { ...this.state.postModel, [event.target.id]: event.target.value },
    });
  };

  openModal = () => {
    this.setState({
      modal: true,
    });
  };

  closeModal = () => {
    this.setState({
      modal: false,
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="headerRoot">
        <Button>
          <Button.Content>Latest</Button.Content>
        </Button>
        <Button>
          <Button.Content>Old</Button.Content>
        </Button>
        <Button onClick={this.openModal}>
          <Button.Content>Make a new Post</Button.Content>
        </Button>
        <ModalComponent onSubmit={this.onSubmit} modalClose={this.closeModal} open={this.state.modal}>
          <Form.Group widths={2}>
            <Form.Input id="title" onChange={this.handleValueChange} label="Title" placeholder="Enter Title" />
            <Form.Input id="url" onChange={this.handleValueChange} label="Url" placeholder="Enter Url" />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.TextArea id="description" onChange={this.handleValueChange} label="Description" placeholder="Enter Description" />
            <Form.Input id="author" onChange={this.handleValueChange} label="Author" placeholder="Enter Author" />
          </Form.Group>
        </ModalComponent>
        <Grid>
          <Grid.Column width={6}>
            <Search loading={loading} input={{ icon: "search", iconPosition: "left" }} open={false} onSearchChange={(event: any, data) => this.searchFields(data)} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default HeaderComponent;
