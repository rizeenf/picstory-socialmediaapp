import { useUserContext } from "@/context/AuthContext";
import { timeAgo } from "@/lib/utils";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { PostWithUser } from "@/types";

const PostCard = ({ post }: { post: PostWithUser }) => {
  const { user } = useUserContext();

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3 hover:darker">
          <Link to={`/profile/${post.creator.id}`}>
            <img
              src={
                post?.creator.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 rounded-full lg:h-12 "
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1 line-clamp-1 max-w-52">
              {post?.creator.name}
            </p>
            <div className="gap-2 flex-center text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {timeAgo(post?.createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.id}`}
          className={`hover:invert-white ${
            user?.id !== post?.creator?.id && "hidden"
          }`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post.id}`}>
        <div className="py-5 small-medium lg:base-medium hover:darker">
          <p>{post.caption}</p>

          <ul className="flex gap-1 mt-2">
            {post?.tags?.map((tag: string, index) => (
              <li key={tag + index} className="text-light-3 hover:invert-white">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post?.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={user?.id} />
    </div>
  );
};

export default PostCard;
