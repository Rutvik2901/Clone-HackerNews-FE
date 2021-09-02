import React, { Component } from "react";
import { Button, Form, Grid, Header, Search, Segment } from "semantic-ui-react";
import { PostModelPost } from "../../Constants/Models/PostModel";
import ModalComponent from "../ModalComponent";
import "./styles/index.css";
import store from "../../redux/store";
import { addPosts, doneSearch, postSearch } from "../../redux/actions";
import { baseUrl } from "../../Constants/baseUrl";
import { debounce, toLower, toUpper } from "lodash";

interface IHeaderComponentProps {}
interface IHeaderComponentState {
  loading: boolean;
  postModel: PostModelPost;
}

class HeaderComponent extends Component<IHeaderComponentProps, IHeaderComponentState> {
  constructor(props: IHeaderComponentProps) {
    super(props);
    this.state = {
      loading: false,
      postModel: { title: "", description: "", author: "", url: "", votes: 0 },
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
        .then((res) => store.dispatch(addPosts(res)));
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
        <ModalComponent content={"Make a new Post"} onSubmit={this.onSubmit}>
          <Form.Group widths={2}>
            <Form.Input id="title" onChange={(event: any) => this.handleValueChange(event)} label="Title" placeholder="Enter Title" />
            <Form.Input id="url" onChange={(event: any) => this.handleValueChange(event)} label="Url" placeholder="Enter Url" />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.TextArea id="description" onChange={(event: any) => this.handleValueChange(event)} label="Description" placeholder="Enter Description" />
            <Form.Input id="author" onChange={(event: any) => this.handleValueChange(event)} label="Author" placeholder="Enter Author" />
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
