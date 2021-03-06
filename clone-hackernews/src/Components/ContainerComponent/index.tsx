import "Components/ContainerComponent/Styles/index.css";
import MessageComponent from "Components/MessageComponent";
import { baseUrl } from "Constants/baseUrl";
import { millisToHoursAndMinutesAndSeconds } from "Constants/Methods/millisecondsToHoursMinutesSeconds";
import PostModel from "Constants/Models/PostModel";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { addPosts, getPost, postGet } from "redux/actions";
import store from "redux/store";
import { Button, Card, Dimmer, Grid, Icon, Label, Loader, Message } from "semantic-ui-react";

interface IContainerComponentProps {}
interface IContainerComponentState {
  posts: Array<PostModel>;
  loading: boolean;
  isGetPost: boolean;
  error: boolean;
}

class ContainerComponent extends Component<IContainerComponentProps, IContainerComponentState> {
  constructor(props: IContainerComponentProps) {
    super(props);
    this.state = {
      posts: [],
      loading: false,
      isGetPost: false,
      error: false,
    };
  }

  componentDidMount() {
    this.getPosts();
    store.subscribe(this.updatePosts);
  }

  updatePosts = () => {
    const state = store.getState();
    this.setState({ posts: state.posts.posts.content, loading: state.loading.searchLoader, isGetPost: state.loading.postLoader });
  };

  private getPosts = () => {
    store.dispatch(getPost());
    fetch(baseUrl + "/post")
      .then((res) => res.json())
      .then((res) => {
        store.dispatch(addPosts(res));
        store.dispatch(postGet());
      })
      .catch(() => {
        this.setState({ error: true });
        store.dispatch(postGet());
      });
  };

  private likePost = (postId: string | undefined) => {
    fetch(baseUrl + "/like/post/" + postId, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => this.getPosts())
      .catch(() => {
        this.setState({ error: true });
      });
  };

  private dislikePost = (postId: string | undefined) => {
    fetch(baseUrl + "/dislike/post/" + postId, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        this.getPosts();
      })
      .catch(() => {
        this.setState({ error: true });
      });
  };

  render() {
    const { posts, loading, isGetPost, error } = this.state;
    const currentDate = Date.parse(new Date().toUTCString());
    return (
      <>
        {error && <MessageComponent messageHeader={"Error doing operation"} messageBody={"Please try again later"} onDismiss={() => this.setState({ error: false })} />}
        {loading || isGetPost ? (
          <Dimmer active>
            <Loader size="large">Getting Data</Loader>
          </Dimmer>
        ) : (
          <Grid id="posts" columns={4} stackable doubling>
            {posts &&
              posts.length &&
              posts.map((post: PostModel) => (
                <Grid.Column id="grid">
                  <Card raised className="postContent">
                    <Card.Content id="cardContent">
                      <Card.Header className="cardContent cardFontColor" href={post.url}>
                        <abbr title={post.title}>{post.title}</abbr>
                      </Card.Header>
                      <Card.Header className="cardContent cardUrl cardFontColor" href={post.url}>
                        {post.url}
                      </Card.Header>
                      <Card.Description className="description cardFontColor">{post.description}</Card.Description>
                    </Card.Content>
                    <Card.Content id="cardExtra" extra>
                      <div id="actionButtons">
                        <Button id="likeButton" onClick={() => this.likePost(post.id)} color="facebook">
                          <Icon id="likeButtonColor" name="thumbs up" />
                        </Button>

                        <Label id="votes">{post.votes}</Label>

                        <Button id="dislikeButton" onClick={() => this.dislikePost(post.id)} color="facebook">
                          <Icon id="dislikeButtonColor" name="thumbs down" />
                        </Button>
                      </div>
                      <div className="cardFontColor">
                        Created {millisToHoursAndMinutesAndSeconds(currentDate - Date.parse(post.createdAt ? post.createdAt : ""))} ago By{" "}
                        <abbr title={post.author}>
                          <p id="authorOverflow">{post.author}</p>
                        </abbr>{" "}
                        <Link className="cardFontColor link" to={{ pathname: `/comment/post/${post.id}`, state: { post } }}>
                          {post.comment?.length ? post.comment.length + " comments" : "Discuss"}
                        </Link>
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
          </Grid>
        )}
      </>
    );
  }
}

export default ContainerComponent;
