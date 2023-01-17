import { useEffect, useRef, useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";

import GET_TEST_DATA from "../../graphql/queries";
import Repo from "../Repo";
import { stateType } from "../types";

const FrontPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [state, setState] = useState<stateType>({
    repositories: [],
    hasMore: false,
    cursor: "",
  });
  const [getRepositories, { loading, data }] = useLazyQuery(GET_TEST_DATA, {
    fetchPolicy: "network-only",
  });

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

  const observer = useRef<IntersectionObserver>();
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
    <div className="FrontPage">
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          className="FrontPage_input"
          placeholder="Type at least three letters"
        />
      </div>
      <div className="repos_container">
        {repositories.length > 0 &&
          repositories.map((repo, index) => (
            <Repo
              name={repo.node.name}
              createdAt={repo.node.createdAt}
              owner={repo.node.owner}
              reference={
                repositories.length === index + 1 ? lastRepoRef : undefined
              }
              key={index}
            />
          ))}
      </div>
    </div>
  );
};

export default FrontPage;
