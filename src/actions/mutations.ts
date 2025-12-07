import { graphql } from "../../generated/graphql/index.js";

export const setDescriptionMutation = graphql(`
  mutation setDescription($repositoryId: ID!, $description: String) {
    updateRepository(
      input: { repositoryId: $repositoryId, description: $description }
    ) {
      __typename
    }
  }
`);

export const setArchivedMutation = graphql(`
  mutation setArchived($repositoryId: ID!) {
    archiveRepository(input: { repositoryId: $repositoryId }) {
      __typename
    }
  }
`);

export const setUnarchivedMutation = graphql(`
  mutation setUnarchived($repositoryId: ID!) {
    archiveRepository(input: { repositoryId: $repositoryId }) {
      __typename
    }
  }
`);

// Visibility change not available (?) via the graph

export const setTopicsMutation = graphql(`
  mutation setTopics($repositoryId: ID!, $topicNames: [String!]!) {
    updateTopics(
      input: { repositoryId: $repositoryId, topicNames: $topicNames }
    ) {
      __typename
    }
  }
`);
