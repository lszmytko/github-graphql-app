import React from "react";
import Repo from "../Repo";
import { repositoryType } from "./types";

const FrontPagePres: React.FC<{
  repositories: repositoryType[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  lastRepoRef: (node: any) => void;
}> = (props) => {
  const { repositories, inputValue, setInputValue, lastRepoRef } = props;
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
        {repositories &&
          repositories.map((repo, index) => {
            if (repositories.length === index + 1) {
              return (
                <Repo
                  name={repo.node.name}
                  createdAt={repo.node.createdAt}
                  owner={repo.node.owner}
                  reference={
                    repositories.length === index + 1 ? lastRepoRef : undefined
                  }
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
