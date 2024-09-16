import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();

  const { data: post, isPending: isGettingPost } = useGetPostById(id || "");

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="justify-start w-full max-w-5xl gap-3 flex-start">
          <img
            src="/assets/icons/add-post.svg"
            alt="edit"
            width={36}
            height={36}
          />
          <h2 className="w-full text-left h3-bold md:h2-bold">Edit post</h2>
        </div>

        {isGettingPost ? <Loader /> : <PostForm action="update" post={post} />}
      </div>
    </div>
  );
};

export default EditPost;
