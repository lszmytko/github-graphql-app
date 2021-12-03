import { gql, useLazyQuery } from "@apollo/client";

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

export default GET_TEST_DATA;
