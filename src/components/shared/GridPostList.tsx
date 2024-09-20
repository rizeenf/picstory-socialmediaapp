import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { PostWithUser } from "@/types";

type GridPostListProps = {
  posts: PostWithUser[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.id} className="relative min-w-80 h-80 hover:darker">
          <Link to={`/posts/${post.id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="object-cover w-full h-full"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start flex-1 gap-2">
                <img
                  src={post?.creator?.imageUrl!}
                  alt="creator"
                  className="w-6 h-6 rounded-full"
                />
                <p className="line-clamp-1 max-w-40">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
