import { graphql } from "../../generated/graphql/index.js";

export const hyfQ2 = graphql(`
  query hyfQ2($owner: String!, $name: String!, $first: Int!, $after: String) {
    repository(owner: $owner, name: $name) {
      id
      name

      repositoryTopics(first: $first, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          topic {
            name
          }
        }
      }
    }
  }
`);
