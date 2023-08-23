import { Navigate, useParams } from "react-router-dom"
import { graphql } from "../graphql_codegen/gql"
import { translator } from "../utils/uuid"
import { useQuery } from "@tanstack/react-query"
import { graphQLClient } from "../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import Post from "../components/post/single/Post"
import PostCommentForm from "../components/post/single/PostCommentForm"
import PostCommentFeed from "../components/post/single/PostCommentFeed"

const getPostDocument = graphql(/* GraphQL */ `
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

const PostPage = () => {
  const { title, id } = useParams()
  const uuid = translator.toUUID(id!)

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: [uuid],
    queryFn: () =>
      graphQLClient.request(getPostDocument, {
        input: {
          id: uuid,
        },
      }),
  })

  if (postLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!post?.post || post.post.title !== title) {
    return <Navigate to="/404-not-found" />
  }

  return (
    <div className="flex flex-col gap-5 sm:w-[80%] sm-max:w-full break-words min-w-0 mx-auto">
      <Post post={post.post} />
      <PostCommentForm post={post.post} />
      <PostCommentFeed post={post.post} />
    </div>
  )
}

export default PostPage
