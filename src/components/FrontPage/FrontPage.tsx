import { useEffect, useRef, useState, useCallback } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import FrontPagePres from "./FrontPagePres";
import moment from "moment";
import "moment/locale/pl";
import GET_TEST_DATA from "../../graphql/queries";
import { stateType } from "./types";

// SETTING LOCALE TO PL
moment.locale("pl");

const FrontPage = () => {
  const [inputValue, setInputValue] = useState("");

  const [state, setState] = useState<stateType>({
    repositories: [],
    hasMore: false,
    cursor: "",
  });
  const [getRepositories, { loading, data, fetchMore }] = useLazyQuery(
    GET_TEST_DATA,
    { fetchPolicy: "network-only" }
  );

  const { repositories, hasMore, cursor } = state;

  const fetchMoreData = (afterItem?: string) => {
    getRepositories({
      variables: {
        input: inputValue,
        reposPerFetch: 20,
        after: afterItem,
      },
    });
  };

  // FETCHING DATA AFTER 3 LETTERS
  useEffect(() => {
    inputValue.length >= 3 && fetchMoreData();
    setState({ repositories: [], hasMore: false, cursor: "" });
  }, [inputValue]);

  // SETTING STATES AFTER FETCHING DATA
  useEffect(() => {
    if (data && inputValue.length >= 3) {
      setState((prevState) => ({
        repositories: [...prevState.repositories, ...data.search.edges],
        cursor: data.search.pageInfo.endCursor,
        hasMore: data.search.pageInfo.hasNextPage,
      }));
    }
  }, [data]);

  // INFFINITE SCROLL FETCHING DATA

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
      lastRepoRef={lastRepoRef}
    />
  );
};

export default FrontPage;
