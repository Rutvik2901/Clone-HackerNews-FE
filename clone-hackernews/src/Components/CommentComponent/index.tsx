import "Components/CommentComponent/Styles/index.css";
import MessageComponent from "Components/MessageComponent";
import ModalComponent from "Components/ModalComponent";
import { baseUrl } from "Constants/baseUrl";
import { millisToHoursAndMinutesAndSeconds } from "Constants/Methods/millisecondsToHoursMinutesSeconds";
import CommentModel from "Constants/Models/CommentModel";
import { annonymous, commentAvatar } from "Constants/stringConstants";
import React, { Component } from "react";
import { RouteProps } from "react-router";
import { Button, Comment, Container, Feed, Form, Header, Loader, TextArea } from "semantic-ui-react";

interface parentChildStructure {
  [key: string]: Array<Array<{ comment: CommentModel; level: number }>>;
}
interface parentChildStructureTemp {
  [key: string]: Array<CommentModel>;
}

interface ICommentCompoentProps {
  id: String;
}

interface ICommentCompoentState {
  commentsByPost: Array<CommentModel>;
  commentValue: string;
  post: any;
  replyCommentId: string;
  replyCommentValue: string;
  modal: boolean;
  formError: boolean;
  isModalComment: boolean;
  commentSubmit: boolean;
  error: boolean;
}

class CommentComponent extends Component<ICommentCompoentProps & RouteProps, ICommentCompoentState> {
  private parentChildRelationComment: parentChildStructure = {};
  private parentChildRelationTemp: parentChildStructureTemp = {};

  constructor(props: ICommentCompoentProps & RouteProps) {
    super(props);
    this.state = {
      commentsByPost: [],
      commentValue: "",
      post: {},
      replyCommentId: "",
      replyCommentValue: "",
      modal: false,
      formError: false,
      isModalComment: false,
      commentSubmit: false,
      error: false,
    };
  }
  componentDidMount() {
    this.getComments();
    this.setState({
      post: this.props.location?.state,
    });
  }

  private getComments = () => {
    fetch(baseUrl + "/comment/post/" + this.props.id)
      .then((res) => res.json())
      .then((res) => this.setState({ commentsByPost: res }));
  };

  private findSubComments = (comments: Array<CommentModel>, level: number, parent: string) => {
    comments.forEach((comment: CommentModel) => {
      this.parentChildRelationComment[parent].push([{ comment: comment, level: level }]);
      if (this.parentChildRelationTemp[comment.id] !== undefined) {
        this.findSubComments(this.parentChildRelationTemp[comment.id], level + 1, parent);
      }
    });
  };

  private submitSubComments = () => {
    const { replyCommentId, replyCommentValue, formError } = this.state;
    if (replyCommentValue.length === 0) {
      this.setState({
        formError: true,
      });
    } else {
      this.setState({
        isModalComment: true,
      });
      fetch(baseUrl + "/comment/post/" + this.props.id + "/parent/" + replyCommentId, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: replyCommentValue,
      }).then(() => {
        this.componentDidMount();
        this.closeModal();
      });
    }
  };

  private handleCommentValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ commentValue: event.target.value });
  };

  private submitComment = () => {
    const { commentValue, commentSubmit } = this.state;
    const { id } = this.props;

    if (commentValue.length !== 0) {
      this.setState({ commentSubmit: true });
      fetch(baseUrl + "/comment/post/" + id, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: commentValue,
      })
        .then(() => {
          this.getComments();
          this.setState({
            commentValue: "",
            commentSubmit: false,
          });
        })
        .catch(() => {
          this.setState({ commentSubmit: false, error: true });
        });
    }
  };

  private handleReplyCommentValueChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      replyCommentValue: event.target.value,
    });
  };

  private findRootComments = (): Array<CommentModel> => {
    const { commentsByPost } = this.state;
    return commentsByPost.filter((post: CommentModel) => post.parent === null);
  };

  private commentParentChildRelation = () => {
    const { commentsByPost } = this.state;

    commentsByPost.forEach((post: CommentModel) => {
      if (post.parent !== null) {
        this.parentChildRelationTemp[post.parent.id] = [];
      }
    });

    commentsByPost.forEach((post: CommentModel) => {
      if (post.parent !== null) {
        this.parentChildRelationTemp[post.parent.id].push(post);
      }
    });

    this.findRootComments().forEach((post: CommentModel) => {
      this.parentChildRelationComment[post.id] = [[{ comment: post, level: 0 }]];
      if (this.parentChildRelationTemp[post.id]) this.findSubComments(this.parentChildRelationTemp[post.id], 1, post.id);
    });
  };

  private openModal = (id: string) => {
    this.setState({
      modal: true,
      replyCommentId: id,
    });
  };
  private closeModal = () => {
    this.setState({ modal: false, formError: false, replyCommentValue: "", isModalComment: false });
  };

  render() {
    const {
      commentValue,
      post: { post },
      formError,
      modal,
      isModalComment,
      commentSubmit,
      error,
    } = this.state;

    this.commentParentChildRelation();

    const currentDate = Date.parse(new Date().toUTCString());

    return (
      <>
        {error && <MessageComponent messageHeader={"Failed to Post Comment"} messageBody={"Please try again later"} onDismiss={() => this.setState({ error: false })} />}
        <ModalComponent isModalPost={isModalComment} content={"Comment"} open={modal} onSubmit={this.submitSubComments} modalClose={this.closeModal}>
          <Form.TextArea error={formError} id="comment" onChange={this.handleReplyCommentValueChange} placeholder="Enter Comment" />
        </ModalComponent>
        <Container id="container">
          <div className="postRoot">
            <Feed>
              <Feed.Event>
                <Feed.Content>
                  <Feed.Summary>
                    <a className="commentTitle" href={post && post.url}>
                      {post && post.title} {post && post.url}
                    </a>{" "}
                    <Feed.User className="feedUser"> posted By {post && post.author}</Feed.User>
                    <Feed.Date className="feedDate">{post && millisToHoursAndMinutesAndSeconds(currentDate - Date.parse(post.createdAt))} ago</Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra className="feedExtra" text>
                    {post && post.description}
                  </Feed.Extra>
                </Feed.Content>
              </Feed.Event>
            </Feed>
            <div className="textButton">
              <TextArea id="comment" error={formError} value={commentValue} className="textarea" onChange={this.handleCommentValueChange} placeholder="Write a Comment" />
              <Button disabled={commentSubmit} id="submitButton" onClick={this.submitComment}>
                {commentSubmit ? <Loader size="tiny" inline="centered" active /> : "Submit"}
              </Button>
            </div>
          </div>
          {!!Object.keys(this.parentChildRelationComment).length && (
            <Comment.Group id="commentGroup">
              <Header id="commentHeader" as="h3" dividing>
                Comments
              </Header>
              {Object.keys(this.parentChildRelationComment)
                .slice()
                .reverse()
                .map((rootComment) => {
                  return this.parentChildRelationComment[rootComment].map((subComment) => (
                    <div id="rootComment" style={{ marginLeft: subComment[0]["level"] * 50 }}>
                      <Comment>
                        <Comment.Avatar src={commentAvatar} />

                        <Comment.Content>
                          <Comment.Author className="commentAuthor" as="a">
                            {annonymous}
                          </Comment.Author>
                          <Comment.Metadata className="commentMeta">{millisToHoursAndMinutesAndSeconds(currentDate - Date.parse(subComment[0]["comment"].timeZone))} ago</Comment.Metadata>
                          <Comment.Text className="commentText">{subComment[0]["comment"].description}</Comment.Text>
                          <Comment.Actions>
                            <Comment.Action>
                              <a className="commentAction" onClick={() => this.openModal(subComment[0]["comment"].id)}>
                                reply
                              </a>
                            </Comment.Action>
                          </Comment.Actions>
                        </Comment.Content>
                      </Comment>
                    </div>
                  ));
                })}
            </Comment.Group>
          )}
        </Container>
      </>
    );
  }
}

export default CommentComponent;
