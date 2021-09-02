import PostModel from "../../Constants/Models/PostModel";

const intiState = {
  posts: Array<PostModel>(),
};

export default function (state = intiState, action: any) {
  switch (action.type) {
    case "ADD_POST":
      return {
        ...state,
        posts: action.payload,
      };

    default:
      return state;
  }
}
