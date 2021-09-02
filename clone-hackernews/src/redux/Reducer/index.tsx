import { combineReducers } from "redux";
import posts from "redux/Reducer/postReducer";
import comments from "redux/Reducer/commentReducer";
import loading from "redux/Reducer/loadingReducer";

export default combineReducers({ posts, comments, loading });
