export type repositoryType = {
  node: {
    name: string;
    createdAt: string;
    owner: { login: string; avatarUrl: string };
  };
};

export type stateType = {
  repositories: repositoryType[];
  hasMore: boolean;
  cursor: string;
};

export type repoType = {
  name: string;
  createdAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  reference?: (node: any) => void;
};
