const initState = { searchLoader: false, postLoader: false };

export default function (state = initState, action: any) {
  switch (action.type) {
    case "POST_SEARCH":
      return { ...state, searchLoader: true };

    case "DONE_SEARCH":
      return { ...state, searchLoader: false };

    case "GET_POST":
      return { ...state, postLoader: true };

    case "POST_GET":
      return { ...state, postLoader: false };

    default:
      return state;
  }
}
