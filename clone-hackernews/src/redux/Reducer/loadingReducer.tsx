const intiState = false;

export default function (state = intiState, action: any) {
  switch (action.type) {
    case "POST_SEARCH":
      state = true;
      return state;

    case "DONE_SEARCH":
      state = false;
      return state;

    default:
      return state;
  }
}
