import { Database } from "@/lib/supabase/supabase_types";
import React from "react";

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type Post = Database["public"]["Tables"]["Posts"]["Row"];
export type User = Database["public"]["Tables"]["Users"]["Row"];
export type Save = Database["public"]["Tables"]["Saves"]["Row"];
export type Face = Database["public"]["Tables"]["Faces"]["Row"];

export interface PostWithUser extends Omit<Post, "creator"> {
  creator: User;
}
