import { graphql } from "../../generated/graphql/index.js";

export const hyfQ1 = graphql(`
  query hyfQ1(
    $owner: String!
    $first: Int!
    $after: String
    $firstTopics: Int!
  ) {
    repositoryOwner(login: $owner) {
      repositories(first: $first, after: $after, ownerAffiliations: [OWNER]) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          name
          owner {
            login
          }
          url
          isEmpty
          isFork
          isMirror

          description
          isArchived
          isDisabled
          isLocked
          isPrivate
          visibility
          forkingAllowed

          repositoryTopics(first: $firstTopics) {
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
    }
  }
`);
