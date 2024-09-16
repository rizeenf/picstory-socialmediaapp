import { PostValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FileUploader from "../shared/FileUploader";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import { PostWithUser } from "@/types";

type PostFormProps = {
  post?: PostWithUser;
  action: "create" | "update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  const { user } = useUserContext();
  const navigate = useNavigate();

  console.log(post);
  let tags = post?.tags?.join(" ");

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption! : "",
      file: [],
      location: post ? post?.location! : "",
      tags: post ? tags : "",
    },
  });
  const { handleSubmit, control } = form;

  const onSubmit = async (data: z.infer<typeof PostValidation>) => {
    if (post && action === "update") {
      const updatedPost = await updatePost({
        ...data,
        postId: post?.id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });

      if (!updatedPost) {
        toast({ title: "Failed, please try again." });
      }

      return navigate(`/posts/${post?.id}`);
    }

    const newPost = await createPost({
      ...data,
      userId: user?.id,
    });

    if (!newPost) {
      toast({ title: "Failed, please try again." });
    }

    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-5xl gap-9"
      >
        <FormField
          control={control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl!}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , " )
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Jakarta, Bekasi, React"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            className="shad-button_dark_4 hover:invert-dark"
          >
            Cancel
          </Button>

          <Button
            disabled={isCreatingPost || isLoadingUpdate}
            type="submit"
            className="capitalize shad-button_primary whitespace-nowrap hover:invert-dark"
          >
            {isCreatingPost || isLoadingUpdate ? (
              <div className="gap-2 flex-center">
                <Loader /> Loading...
              </div>
            ) : (
              action
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
