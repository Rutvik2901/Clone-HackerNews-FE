import React from "react";
import PostModel from "Constants/Models/PostModel";

export default interface CommentModel {
  id: string;
  description: string;
  parent: CommentModel;
  timeZone: string;
  post: PostModel;
}
