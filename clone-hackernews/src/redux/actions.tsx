import PostModel from "../Constants/Models/PostModel";
export const addPosts = (content: Array<PostModel>) => ({
  type: "ADD_POST",
  payload: {
    content,
  },
});

export const postSearch = () => ({
  type: "POST_SEARCH",
});

export const doneSearch = () => ({
  type: "DONE_SEARCH",
});
