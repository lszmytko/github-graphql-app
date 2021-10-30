import { useEffect, useRef, useState, useCallback } from "react";
import {gql, useLazyQuery } from "@apollo/client";
import FrontPagePres from "./FrontPagePres";
import moment from "moment";
import "moment/locale/pl";


// SETTING LOCALE TO PL 
moment.locale("pl");


const GET_TEST_DATA = gql`
  query getData($input: String!, $reposPerFetch: Int!, $after: String) {
    search(
      query: $input
      type: REPOSITORY
      first: $reposPerFetch
      after: $after
    ) {
      repositoryCount
      pageInfo {
        endCursor
        startCursor
        hasNextPage
      }
      edges {
        node {
          ... on Repository {
            name
            createdAt
            owner {
              login
              avatarUrl
            }
          }
        }
      }
    }
  }
`;

const FrontPage = () => {
  const [repositories, setRepositories] = useState<
    Array<{
      node: {
        name: string;
        createdAt: string;
        owner: { login: string; avatarUrl: string };
      };
    }>
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
      getRepositories({
        variables: {
          input: inputValue,
          reposPerFetch: 20,
          after: null,
        },
      });
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
    } else if (inputValue.length < 3) {
      setRepositories([]);
      SetCursor("");
      setHasMore(false);
    }
  }, [data]);

  // INFFINITE SCROLL FETCHING DATA

  const fetchMoreData = () => {
    getRepositories({
      variables: {
        input: inputValue,
        reposPerFetch: 20,
        after: cursor,
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
            fetchMoreData();
          }
        },
        { rootMargin: "50px" }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
    <FrontPagePres
      repositories={repositories}
      inputValue={inputValue}
      setInputValue={setInputValue}
      fetchMoreData={fetchMoreData}
      lastRepoRef={lastRepoRef}
    />
    {loading && <p>Loading...</p>}
    </>
  );
};

export default FrontPage;
