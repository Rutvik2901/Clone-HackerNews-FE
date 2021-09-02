import { combineReducers } from "redux";
import posts from "./postReducer";
import comments from "./commentReducer";
import loading from "./loadingReducer";

export default combineReducers({ posts, comments, loading });
