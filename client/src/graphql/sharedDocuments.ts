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

export const getPostFeedDocument = graphql(/* GraphQL */ `
  query PostFeed($input: PostsInput!) {
    posts(input: $input) {
      edges {
        node {
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
      pageInfo {
        endCursor {
          id
          voteSum
          created_at
        }
        hasNextPage
      }
      orderBy
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
          parent {
            id
          }
          voteSum
          voteStatus
          replyCount
        }
      }
      pageInfo {
        endCursor {
          id
          created_at
          voteSum
        }
        hasNextPage
      }
      orderBy
    }
  }
`)

export const getCommentRepliesFeedDocument = graphql(/* GraphQL */ `
  query CommentRepliesFeed($input: CommentsInput!) {
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
          parent {
            id
          }
          voteSum
          voteStatus
          replyCount
        }
      }
      pageInfo {
        endCursor {
          id
          created_at
          voteSum
        }
        hasNextPage
      }
      orderBy
    }
  }
`)

export const getCommunityFeedDocument = graphql(/* GraphQL */ `
  query CommunityFeed($input: CommunitiesInput!) {
    communities(input: $input) {
      edges {
        node {
          created_at
          id
          inCommunity
          memberCount
          owner {
            id
            username
          }
          postCount
          title
          updated_at
        }
      }
      pageInfo {
        endCursor {
          id
          created_at
          title
        }
        hasNextPage
      }
      memberOf
    }
  }
`)

export const usernameExistsDocument = graphql(/* GraphQL */ `
  query UsernameExists($username: String!) {
    usernameExists(username: $username)
  }
`)

export const communityTitleExistsDocument = graphql(/* GraphQL */ `
  query CommunityTitleExists($title: String!) {
    titleExists(title: $title)
  }
`)

export const getPostDocument = graphql(/* GraphQL */ `
  query SinglePost($input: PostInput!) {
    post(input: $input) {
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
`)

export const getCommentDocument = graphql(/* GraphQL */ `
  query SingleComment($input: CommentInput!) {
    comment(input: $input) {
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
`)
