import React from "react";
import Repo from "../Repo";

interface Iprops {
  repositories: Array<{
    node: {
      name: string;
      createdAt: string;
      owner: { login: string; avatarUrl: string };
    };
  }>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  fetchMoreData: () => void;
  lastRepoRef: (node: any) => void;
}

const FrontPagePres = ({
  repositories,
  inputValue,
  setInputValue,
  fetchMoreData,
  lastRepoRef,
}: Iprops) => {
  return (
    <div className="FrontPage">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        className="FrontPage_input"
        placeholder="Wpisz repozytorium"
      />
      <div className="repos_container">
        {repositories &&
          repositories.map((repo, index) => {
            if (repositories.length === index + 1) {
              return (
                <Repo
                  name={repo.node.name}
                  createdAt={repo.node.createdAt}
                  owner={repo.node.owner}
                  reference={lastRepoRef}
                  key={index}
                />
              );
            } else
              return (
                <Repo
                  name={repo.node.name}
                  createdAt={repo.node.createdAt}
                  owner={repo.node.owner}
                  key={index}
                />
              );
          })}
      </div>
    </div>
  );
};

export default FrontPagePres;
