import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  interviewee?: Author; // For AMA posts, the person being interviewed
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
  topics?: string[];
  // Internal property to track the file path for content lookup
  _contentPath?: string;
};
