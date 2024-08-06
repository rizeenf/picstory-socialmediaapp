import { Models } from "appwrite"
import Loader from "./Loader"
import GridPostList from "./GridPostList"


type SearchResultProps = {
  isSearchFetching: boolean,
  searchPosts: Models.Document[]
}

const SearchResults = ({ isSearchFetching, searchPosts }: SearchResultProps) => {

  if (isSearchFetching) return <Loader />

  if (searchPosts && searchPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchPosts.documents} showStats={true} />
    )
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No post found</p>
  )
}

export default SearchResults