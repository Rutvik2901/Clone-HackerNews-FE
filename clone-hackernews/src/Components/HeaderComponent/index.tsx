import { debounce, toLower } from "lodash";
import React, { Component } from "react";
import { Button, Form, Grid, Search, Menu, Container, Visibility, Segment } from "semantic-ui-react";
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
  formError: boolean;
}

class HeaderComponent extends Component<IHeaderComponentProps, IHeaderComponentState> {
  constructor(props: IHeaderComponentProps) {
    super(props);
    this.state = {
      loading: false,
      postModel: { title: "", description: "", author: "", url: "", votes: 0 },
      modal: false,
      formError: false,
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

  private getPosts = () => {
    fetch(baseUrl + "/post")
      .then((res) => res.json())
      .then((res) => {
        store.dispatch(addPosts(res));
        this.closeModal();
      });
  };

  private onSubmit = () => {
    const { postModel } = this.state;
    if (postModel.author.length === 0) {
      postModel.author = "Annonymous";
    }

    if (postModel.description.length === 0 || postModel.title.length === 0) {
      this.setState({
        formError: true,
      });
    } else {
      fetch(baseUrl + "/post", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postModel),
      }).then(() => {
        this.getPosts();
      });
    }
  };

  private searchPaginated = debounce((params: string) => {
    fetch(baseUrl + "/post?search=" + toLower(params))
      .then((res) => res.json())
      .then((res) => {
        store.dispatch(doneSearch());
        store.dispatch(addPosts(res));
      });
  }, 500);

  private getOldPosts = () => {
    fetch(baseUrl + "/post?older=true")
      .then((res) => res.json())
      .then((res) => {
        store.dispatch(addPosts(res));
        this.closeModal();
      });
  };

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
      formError: false,
      postModel: { title: "", description: "", author: "", url: "", votes: 0 },
    });
  };

  render() {
    const { loading, formError } = this.state;
    return (
      <div className="headerRoot">
        <Segment inverted textAlign="center" style={{ padding: "1em 0em", marginBottom: 20 }}>
          <Menu fixed="top" size="small">
            <Container>
              <Menu.Item>
                <Button onClick={this.getPosts}>
                  <Button.Content>Latest</Button.Content>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button onClick={this.getOldPosts}>
                  <Button.Content>Old</Button.Content>
                </Button>
              </Menu.Item>

              <Menu.Item position="right">
                <Button onClick={this.openModal}>
                  <Button.Content>Create Post</Button.Content>
                </Button>

                <ModalComponent onSubmit={this.onSubmit} modalClose={this.closeModal} open={this.state.modal}>
                  <Form.Group widths={2}>
                    <Form.Input error={formError} id="title" onChange={this.handleValueChange} label="Title" placeholder="Enter Title" />
                    <Form.Input id="url" onChange={this.handleValueChange} label="Url" placeholder="Enter Url" />
                  </Form.Group>
                  <Form.Group widths={2}>
                    <Form.TextArea error={formError} id="description" onChange={this.handleValueChange} label="Description" placeholder="Enter Description" />
                    <Form.Input id="author" onChange={this.handleValueChange} label="Author" placeholder="Enter Author" />
                  </Form.Group>
                </ModalComponent>
              </Menu.Item>
              <Menu.Item>
                <Grid>
                  <Grid.Column width={6}>
                    <Search loading={loading} input={{ icon: "search", iconPosition: "left" }} open={false} onSearchChange={(event: any, data) => this.searchFields(data)} />
                  </Grid.Column>
                </Grid>
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </div>
    );
  }
}

export default HeaderComponent;
