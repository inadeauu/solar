import { Navigate, useParams } from "react-router-dom"
import { translator } from "../utils/uuid"
import { ImSpinner11 } from "react-icons/im"
import Post from "../components/post/single/Post"
import PostCommentForm from "../components/post/single/PostCommentForm"
import PostCommentFeed from "../components/post/single/PostCommentFeed"
import { useContext } from "react"
import Dropdown from "../components/misc/Dropdown"
import { CommentContext } from "../contexts/CommentContext"
import { usePost } from "../graphql/useQuery"

const PostPage = () => {
  const { id } = useParams()
  const uuid = translator.toUUID(id || "")

  const { commentOrderBy, setCommentOrderBy } = useContext(CommentContext)

  const { data, isLoading } = usePost(uuid)

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.post) {
    return <Navigate to="/404-not-found" />
  }

  return (
    <div className="flex flex-col gap-5 sm:w-[80%] sm-max:w-full break-words min-w-0 mx-auto">
      <Post post={data.post} />
      <PostCommentForm post={data.post} />
      <Dropdown
        name="comment-order"
        className="py-1"
        width="w-[65px]"
        items={["New", "Old", "Top", "Low"]}
        value={commentOrderBy}
        setValue={setCommentOrderBy}
      />
      <PostCommentFeed post={data.post} />
    </div>
  )
}

export default PostPage
