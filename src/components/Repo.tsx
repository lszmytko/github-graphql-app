import moment from "moment";
import React from "react";

type propType = {
  name: string;
  createdAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  reference?: (node: any) => void;
};

const Repo = (props: propType) => (
  <div className="Repo" ref={props.reference}>
    <img src={props.owner.avatarUrl} alt="avatar" />
    <p>{props.name}</p>
    <p>{moment(props.createdAt).format("D MMMM YYYY")}</p>
    <p>{props.owner.login}</p>
  </div>
);

export default React.memo(Repo);
