import CommentModel from "Constants/Models/CommentModel";

const intiState = {
  comments: Array<CommentModel>(),
};

export default function (state = intiState, action: any) {
  switch (action.type) {
    case "ADD_COMMENT":
      return {
        ...state,
        comments: action.payload,
      };

    default:
      return state;
  }
}
