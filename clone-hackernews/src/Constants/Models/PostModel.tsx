import React from "react";
import CommentModel from "Constants/Models/CommentModel";

export default interface PostModel {
  id?: string;
  title: string;
  description: string;
  author: string;
  votes: number;
  url: string;
  comment?: Array<CommentModel>;
  createdAt?: string;
}
