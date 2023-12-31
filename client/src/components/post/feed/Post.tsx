import { Link, useNavigate } from "react-router-dom"
import moment from "moment"
import { Ref, useLayoutEffect, useRef, useState } from "react"
import PostFooter from "./PostFooter"
import type { Post } from "../../../graphql/types"
import { translator } from "../../../utils/uuid"
import { useAuth } from "../../../hooks/useAuth"

type PostProps = {
  post: Post
  innerRef?: Ref<HTMLAnchorElement> | undefined
  queryKey: any[]
  communityFeed?: boolean
  testid: string
}

const Post = ({ post, innerRef, queryKey, communityFeed = false, testid }: PostProps) => {
  const { user } = useAuth()
  const [overflown, setOverflown] = useState<boolean>(false)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!bodyRef.current) return
    if (bodyRef.current.scrollHeight > bodyRef.current.clientHeight) {
      setOverflown(true)
    }
  }, [])

  return (
    <Link
      data-testid={testid}
      ref={innerRef}
      to={`/posts/${translator.fromUUID(post.id)}`}
      className="bg-white border border-neutral-300 rounded-lg p-4 hover:cursor-pointer hover:border-black group"
    >
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-500 text-xs min-w-0">
            {!communityFeed && (
              <>
                Posted in{" "}
                <span
                  data-testid={`${testid}-community`}
                  className="text-black font-medium hover:underline hover:cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(`/communities/${translator.fromUUID(post.community.id)}`)
                  }}
                >
                  {post.community.title}
                </span>
                {" • "}
              </>
            )}
            Posted by{" "}
            <span
              data-testid={`${testid}-owner`}
              className="text-black font-medium hover:underline hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/profile/${post.owner.username}`)
              }}
            >
              {post.owner.username}
            </span>
            {" • "}
            {moment(post.created_at).fromNow()}
          </span>
          {user?.id == post.owner.id && (
            <button
              data-testid={`${testid}-edit-button`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                navigate(`/posts/${translator.fromUUID(post.id)}/edit`)
              }}
              className="btn_blue text-sm py-[2px] px-3"
            >
              Edit
            </button>
          )}
        </div>
        <span data-testid={`${testid}-title`} className="font-medium text-lg">
          {post.title}
        </span>
        {post.body && (
          <div data-testid={`${testid}-body-container`} ref={bodyRef} className="max-h-[250px] overflow-hidden">
            <p data-testid={`${testid}-body`} className="text-sm font-light text-neutral-800">
              {post.body}
            </p>
          </div>
        )}
        {overflown && (
          <span data-testid={`${testid}-overflown`} className="text-sm text-blue-400 group-visited:text-violet-400">
            See Full Post
          </span>
        )}
      </div>
      <PostFooter testid={testid} post={post} queryKey={queryKey} />
    </Link>
  )
}

export default Post
