import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Container, Dimmer, Icon, Label, Loader } from "semantic-ui-react";
import { baseUrl } from "Constants/baseUrl";
import { millisToHoursAndMinutesAndSeconds } from "Constants/Methods/millisecondsToHoursMinutesSeconds";
import PostModel from "Constants/Models/PostModel";
import { addPosts } from "redux/actions";
import store from "redux/store";
import "Components/ContainerComponent/Styles/index.css";

interface IContainerComponentProps {}
interface IContainerComponentState {
  posts: Array<PostModel>;
  loading: boolean;
}

class ContainerComponent extends Component<IContainerComponentProps, IContainerComponentState> {
  constructor(props: IContainerComponentProps) {
    super(props);
    this.state = {
      posts: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getPosts();
    store.subscribe(this.updatePosts);
  }

  updatePosts = () => {
    const state = store.getState();
    this.setState({ posts: state.posts.posts.content, loading: state.loading });
  };

  private getPosts = () => {
    fetch(baseUrl + "/post")
      .then((res) => res.json())
      .then((res) => store.dispatch(addPosts(res)));
  };

  private likePost = (postId: any) => {
    fetch(baseUrl + "/like/post/" + postId, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => this.getPosts());
  };

  private dislikePost = (postId: any) => {
    fetch(baseUrl + "/dislike/post/" + postId, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => this.getPosts());
  };

  render() {
    const { posts, loading } = this.state;
    const currentDate = Date.parse(new Date().toUTCString());
    return (
      <>
        {loading && (
          <Dimmer active>
            <Loader size="large">Getting Data</Loader>
          </Dimmer>
        )}
        <Container>
          <Card.Group id="posts">
            {posts &&
              posts.map((post: PostModel) => (
                <Card raised className="postContent">
                  <Card.Content className="cardContent" href={post.url}>
                    <Card.Header>{post.title}</Card.Header>
                    <Card.Meta>{post.url}</Card.Meta>
                    <Card.Description className="description">{post.description}</Card.Description>
                  </Card.Content>
                  <Card.Content id="cardExtra" extra>
                    <Button id="actionButtons" as="div">
                      <Button onClick={() => this.likePost(post.id)} color="facebook">
                        <Icon style={{ margin: 0 }} name="thumbs up" />
                      </Button>

                      <Label id="votes" basic color="blue">
                        {post.votes}
                      </Label>

                      <Button onClick={() => this.dislikePost(post.id)} color="facebook">
                        <Icon name="thumbs down" style={{ margin: 0 }} />
                      </Button>
                    </Button>
                    <div>
                      Created {millisToHoursAndMinutesAndSeconds(currentDate - Date.parse(post.createdAt ? post.createdAt : ""))} ago By {post.author.length ? post.author : "Annonymous"}{" "}
                      <Link style={{ textDecoration: "underline" }} to={{ pathname: `/comment/post/${post.id}`, state: { post } }}>
                        Discuss
                      </Link>
                    </div>
                  </Card.Content>
                </Card>
              ))}
          </Card.Group>
        </Container>
      </>
    );
  }
}

export default ContainerComponent;
