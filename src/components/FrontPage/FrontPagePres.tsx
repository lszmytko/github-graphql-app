import React from "react";
import Repo from "../Repo";

const FrontPagePres: React.FC<{
  repositories: {
    node: {
      name: string;
      createdAt: string;
      owner: { login: string; avatarUrl: string };
    };
  }[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  fetchMoreData: () => void;
  lastRepoRef: (node: any) => void;
}> = (props) => {
  const {
    repositories,
    inputValue,
    setInputValue,
    fetchMoreData,
    lastRepoRef,
  } = props;
  return (
    <div className="FrontPage">
      <div className="input-container">
        <input
          type="text"
          value={props.inputValue}
          onChange={(e) => {
            props.setInputValue(e.target.value);
          }}
          className="FrontPage_input"
          placeholder="Wpisz repozytorium"
        />
      </div>
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
