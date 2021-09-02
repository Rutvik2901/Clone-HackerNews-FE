const intiState = false;

export default function (state = intiState, action: any) {
  switch (action.type) {
    case "POST_SEARCH":
      //   console.log("state: ", state, action);
      state = true;
      return state;

    case "DONE_SEARCH":
      //   console.log("state: ", state, action);
      state = false;
      return state;

    default:
      return state;
  }
}
