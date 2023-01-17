import React from "react";
import moment from "moment";
import { repoType } from "./types";

const Repo = (props: repoType) => (
  <div className="Repo" ref={props.reference}>
    <img src={props.owner.avatarUrl} alt="avatar" />
    <p>{props.name}</p>
    <p>{moment(props.createdAt).format("D MMMM YYYY")}</p>
    <p>{props.owner.login}</p>
  </div>
);

export default React.memo(Repo);
