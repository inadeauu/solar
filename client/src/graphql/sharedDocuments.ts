import { graphql } from "../graphql_codegen/gql"

export const votePostDocument = graphql(/* GraphQL */ `
  mutation VotePost($input: VotePostInput!) {
    votePost(input: $input) {
      ... on VotePostSuccess {
        successMsg
        code
        post {
          id
          body
          created_at
          title
          commentCount
          voteSum
          voteStatus
          community {
            id
            title
          }
          owner {
            id
            username
          }
        }
      }
    }
  }
`)

export const getCommunityDocument = graphql(/* GraphQL */ `
  query Community($input: CommunityInput!) {
    community(input: $input) {
      id
      memberCount
      postCount
      inCommunity
      owner {
        id
        username
      }
      title
      created_at
      updated_at
    }
  }
`)

export const getCommentFeedDocument = graphql(/* GraphQL */ `
  query CommentFeed($input: CommentsInput!) {
    comments(input: $input) {
      edges {
        node {
          body
          created_at
          id
          post {
            id
          }
          owner {
            id
            username
          }
          voteSum
          voteStatus
          replyCount
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`)
