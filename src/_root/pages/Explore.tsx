import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPosts,
  useSearchPost,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const { ref, inView } = useInView();

  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  console.log(posts, "postsposts");
  const [searchValue, setSearchValue] = useState("");
  const debounceVal = useDebounce(searchValue, 500);
  const { data: searchPosts, isFetching: isSearchFetching } =
    useSearchPost(debounceVal);

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();

    return () => {};
  }, [inView, searchValue]);

  if (!posts) {
    return (
      <div className="w-full h-full flex-center">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item: any) => item.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="w-full h3-bold md:h2-bold">Search</h2>

        <div className="flex w-full gap-1 px-4 rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={18}
            height={18}
            alt="search"
          />

          <Input
            type="text"
            placeholder="Search.."
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full max-w-5xl mt-16 flex-between mb-7">
        <h3 className="body-bold md:h3-bold">Populars</h3>

        <div className="gap-3 px-4 py-2 cursor-pointer flex-center bg-dark-3 rounded-xl">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={18}
            height={18}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap w-full max-w-5xl gap-9">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchPosts={searchPosts}
          />
        ) : shouldShowPosts ? (
          <p className="w-full mt-10 text-center text-light-4">End of posts</p>
        ) : (
          posts.pages.map((item: any, idx) => (
            <GridPostList key={`page-${idx}`} posts={item} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
