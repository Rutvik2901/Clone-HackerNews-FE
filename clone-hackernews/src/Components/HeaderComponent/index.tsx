import "Components/HeaderComponent/styles/index.css";
import ModalComponent from "Components/ModalComponent";
import { baseUrl } from "Constants/baseUrl";
import PostModel from "Constants/Models/PostModel";
import { annonymous } from "Constants/stringConstants";
import { debounce, toLower } from "lodash";
import React, { Component } from "react";
import { addPosts, doneSearch, postSearch } from "redux/actions";
import store from "redux/store";
import { Button, Container, Form, Icon, Menu, Search } from "semantic-ui-react";

interface IHeaderComponentProps {}
interface IHeaderComponentState {
  loading: boolean;
  postModel: PostModel;
  modal: boolean;
  formError: boolean;
  activeItem: string;
  sortByAscLike: boolean;
  posts: Array<PostModel>;
}

class HeaderComponent extends Component<IHeaderComponentProps, IHeaderComponentState> {
  constructor(props: IHeaderComponentProps) {
    super(props);
    this.state = {
      loading: false,
      postModel: { title: "", description: "", author: "", url: "", votes: 0 },
      modal: false,
      formError: false,
      activeItem: "latest",
      sortByAscLike: false,
      posts: [],
    };
  }

  componentDidMount() {
    store.subscribe(this.searchLoading);
  }

  componentDidUpdate(prevProps: IHeaderComponentProps, prevState: IHeaderComponentState) {
    const { activeItem, sortByAscLike, posts } = this.state;
    if (prevState.posts !== this.state.posts) {
      if (activeItem === "old") {
        posts.sort((a, b) => (a.createdAt && b.createdAt && a.createdAt > b.createdAt ? 1 : -1));
      } else if (activeItem === "likes") {
        if (sortByAscLike === true) {
          posts.sort((a, b) => (a.votes > b.votes ? 1 : -1));
        } else {
          posts.sort((a, b) => (a.votes < b.votes ? 1 : -1));
        }
      }
      store.dispatch(addPosts(posts));
    }
  }

  searchLoading = () => {
    this.setState({
      loading: store.getState().loading,
      posts: store.getState().posts.posts.content,
    });
  };

  private getPosts = () => {
    fetch(baseUrl + "/post")
      .then((res) => res.json())
      .then((res: Array<PostModel>) => {
        store.dispatch(addPosts(res));
      });
  };

  private onSubmit = () => {
    const { postModel } = this.state;
    if (postModel.author.length === 0) {
      postModel.author = annonymous;
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
        this.closeModal();
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
    const { activeItem } = this.state;
    if (activeItem !== "old")
      fetch(baseUrl + "/post?older=true")
        .then((res) => res.json())
        .then((res) => {
          store.dispatch(addPosts(res));
        });
  };

  public searchFields = (data: any) => {
    store.dispatch(postSearch());
    this.searchPaginated(data.value);
  };

  handleValueChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
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

  handleMenuClick = (name: string) => {
    const { sortByAscLike, activeItem } = this.state;
    if (name !== activeItem)
      this.setState({
        activeItem: name,
        sortByAscLike: false,
      });
  };

  private getPostsByLikes = () => {
    const { activeItem } = this.state;
    if (activeItem !== "likes") {
      fetch(baseUrl + "/post?votes=true")
        .then((res) => res.json())
        .then((res) => {
          store.dispatch(addPosts(res));
        });
    }
  };

  sortByLike = () => {
    const { activeItem, posts, sortByAscLike } = this.state;
    if (activeItem === "likes") {
      this.setState({
        sortByAscLike: !sortByAscLike,
      });
      const post = this.state.posts;
      if (sortByAscLike === false) {
        post.sort((a, b) => (a.votes > b.votes ? 1 : -1));
      } else {
        post.sort((a, b) => (a.votes < b.votes ? 1 : -1));
      }
      store.dispatch(addPosts(post));
    }
  };

  render() {
    const { loading, formError, activeItem, sortByAscLike } = this.state;
    return (
      <Menu id="headerRoot" fixed="top" secondary size="small">
        <Container>
          <Menu.Item
            name="latest"
            active={activeItem === "latest"}
            className="menuButton"
            onClick={() => {
              this.getPosts();
              this.handleMenuClick("latest");
            }}
          >
            <Button>
              <Button.Content>Latest</Button.Content>
            </Button>
          </Menu.Item>
          <Menu.Item
            name="old"
            active={activeItem === "old"}
            className="menuButton"
            onClick={() => {
              this.getOldPosts();
              this.handleMenuClick("old");
            }}
          >
            <Button>
              <Button.Content>Old</Button.Content>
            </Button>
          </Menu.Item>
          <Menu.Item
            name="likes"
            active={activeItem === "likes"}
            className="menuButton"
            onClick={() => {
              this.getPostsByLikes();
              this.handleMenuClick("likes");
            }}
          >
            <Button>
              <Button.Content>Likes</Button.Content>
            </Button>
            <Button onClick={this.sortByLike}>{sortByAscLike ? <Icon name="sort amount up"></Icon> : <Icon name="sort amount down"></Icon>}</Button>
          </Menu.Item>

          <Menu.Item position="right" className="menuSearch">
            <Search
              loading={loading}
              input={{ icon: "search", iconPosition: "left" }}
              open={false}
              onSearchChange={(event: React.MouseEvent<HTMLElement, MouseEvent>, data) => this.searchFields(data)}
            />
          </Menu.Item>
          <Menu.Item className="menuButton">
            <Button onClick={this.openModal}>
              <Button.Content>Create Post</Button.Content>
            </Button>

            <ModalComponent content={"Post Details"} onSubmit={this.onSubmit} modalClose={this.closeModal} open={this.state.modal}>
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
        </Container>
      </Menu>
    );
  }
}

export default HeaderComponent;
