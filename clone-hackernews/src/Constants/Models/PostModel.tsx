import React from "react";
import CommentModel from "./CommentModel";

export default interface PostModel {
  id: string;
  title: string;
  description: string;
  author: string;
  votes: number;
  url: string;
  comment: CommentModel;
  createdAt: any;
}

export interface PostModelPost {
  title: string;
  description: string;
  author: string;
  votes: number;
  url: string;
}
