import { useEffect, useRef, useState, useCallback } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import FrontPagePres from "./FrontPagePres";
import moment from "moment";
import "moment/locale/pl";
import GET_TEST_DATA from "../../graphql/queries";

// SETTING LOCALE TO PL
moment.locale("pl");

const FrontPage = () => {
  const [repositories, setRepositories] = useState<
    {
      node: {
        name: string;
        createdAt: string;
        owner: { login: string; avatarUrl: string };
      };
    }[]
  >([]);

  const [inputValue, setInputValue] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [cursor, SetCursor] = useState("");
  const [getRepositories, { loading, data, fetchMore }] = useLazyQuery(
    GET_TEST_DATA,
    { fetchPolicy: "network-only" }
  ); 

  // FETCHING DATA AFTER 3 LETTERS
  useEffect(() => {
    if (inputValue.length >= 3) {
      SetCursor("");
      setHasMore(false);
      setRepositories((prevRepos) => {
        return [];
      });
      fetchMoreData(null)
    } else if (inputValue.length < 3) {
      setRepositories([]);
      SetCursor("");
      setHasMore(false);
    }
  }, [inputValue]);

  // SETTING STATES AFTER FETCHING DATA
  useEffect(() => {
    if (data && inputValue.length >= 3) {
      setRepositories((prevRepos) => {
        return [...prevRepos, ...data.search.edges];
      });
      SetCursor(data.search.pageInfo.endCursor);
      setHasMore(data.search.pageInfo.hasNextPage);
    }
  }, [data]);

  // INFFINITE SCROLL FETCHING DATA

  const fetchMoreData = (afterItem: string | null) => {
    getRepositories({
      variables: {
        input: inputValue,
        reposPerFetch: 20,
        after: afterItem,
      },
    });
  };

  const observer = useRef<any>();
  const lastRepoRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchMoreData(cursor);
          }
        },
        { rootMargin: "50px" }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <FrontPagePres
      repositories={repositories}
      inputValue={inputValue}
      setInputValue={setInputValue}
      fetchMoreData={()=>fetchMoreData(cursor)}
      lastRepoRef={lastRepoRef}
    />
  );
};

export default FrontPage;
