import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { PostWithUser, User } from "@/types";
import { useEffect, useState } from "react";

type PostStatsProps = {
  post: PostWithUser;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likedBy
    ? post?.likedBy!.map((userId: string) => userId)
    : [];
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost, isPending: isLiking } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSave } =
    useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save
    ? currentUser?.save!.find((postId: string) => postId === post.id)
    : "";

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes];

    const alreadyLiked = newLikes.includes(userId);

    if (alreadyLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({
      postId: post.id,
      likesArray: newLikes,
    });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost({
        savedRecordId: savedPostRecord,
      });
    } else {
      savePost({
        postId: post.id,
        userId: userId,
      });
      setIsSaved(true);
    }
  };

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  return (
    <div className="z-20 flex items-center justify-between">
      <div className="flex gap-2 mr-5">
        {/* {isLiking || isGettingUser ? <Loader /> : */}
        <>
          <img
            src={
              checkIsLiked(likes, userId)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className={`cursor-pointer hover:invert-white animation ${
              isLiking && "animate-ping"
            }`}
          />
          <p className="small-medium lg:base-medium">{likes?.length}</p>
        </>
        {/* } */}
      </div>
      <div className="flex gap-2">
        {
          // isSavingPost || isDeletingSave || isGettingUser ? <Loader /> :
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className={`cursor-pointer hover:invert-white animation ${
              isSavingPost || isDeletingSave ? "animate-ping" : ""
            }`}
          />
        }
      </div>
    </div>
  );
};

export default PostStats;
