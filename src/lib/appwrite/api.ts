import { ID, ImageGravity, Query } from 'appwrite'
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl
    })

    return newUser
  } catch (error) {
    console.log(error)
    return error
  }

}

export const saveUserToDB = async (user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) => {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    )

    return newUser
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }

}

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    )

    return session
  } catch (error) {
    console.log(error)
  }

}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}


export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount()

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
    return null
  }
}

export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }
}

export const uploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )

    return uploadedFile
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }
}

export const getFilePreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100,
    )

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }
}

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    )

    return { status: 200 }
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }
}

export const createPost = async (post: INewPost) => {
  try {
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) throw Error



    const fileUrl = getFilePreview(uploadedFile.$id)

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }


    const tags = post?.tags?.replace(/ /g, "").split(",") || []


    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        location: post.location,
        tags: tags,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newPost
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }

}


export const getRecentPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }

}

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }
}

export const savePost = async (postId: string, userId: string) => {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }
}

export const deleteSavedPost = async (saveRecordId: string) => {
  try {
    const updatedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.saveCollectionId,
      saveRecordId
    )

    if (!updatedPost) throw Error

    return { status: 200 }
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }
}


export const getPostById = async (postId: string) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return post
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }

}


export const updatePost = async (post: IUpdatePost) => {
  const hasFile = post.file.length > 0

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId
    }

    if (hasFile) {
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id, }
    }

    const tags = post?.tags?.replace(/ /g, "").split(",") || []


    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        location: post.location,
        tags: tags,
        imageUrl: image.imageUrl,
        imageId: image.imageId
      }
    )

    if (!updatePost) {
      await deleteFile(post.imageId)
      throw Error
    }

    return updatePost
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }

}


export const deletePost = async (postId: string, imageId: string) => {
  if (!postId || !imageId) throw Error


  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return { status: 200 }
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);

  }

}


export const getInfinitePosts = async ({ pageParam }: { pageParam: string | number }) => {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(6)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);

  }

}

export const searchPosts = async (searchTerm: string) => {

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )

    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);

  }

}