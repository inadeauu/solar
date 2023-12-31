import type { Comment } from "../../graphql/types"
import moment from "moment"
import CommentFooter from "./CommentFooter"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { translator } from "../../utils/uuid"

type CommentProps = {
  comment: Comment
  innerRef?: React.LegacyRef<HTMLDivElement> | undefined
  testid: string
}

const Comment = ({ comment, innerRef, testid }: CommentProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div ref={innerRef} className="bg-white border border-neutral-300 rounded-lg py-4 px-[11px]">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-[6px] px-[5px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-neutral-500 text-xs min-w-0 break-words">
              <span
                data-testid={`${testid}-owner`}
                className="text-black font-medium hover:underline hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  navigate(`/profile/${comment.owner.username}`)
                }}
              >
                {comment.owner.username}
              </span>
              {" • "}
              {moment(comment.created_at).fromNow()}
            </span>
            {user?.id == comment.owner.id && (
              <button
                data-testid={`${testid}-edit-button`}
                onClick={() => {
                  navigate(`/comments/${translator.fromUUID(comment.id)}/edit`)
                }}
                className="btn_blue text-sm py-1 px-3"
              >
                Edit
              </button>
            )}
          </div>
          <p data-testid={`${testid}-body`} className="text-sm font-light text-neutral-800">
            {comment.body}
          </p>
        </div>
        <CommentFooter testid={testid} comment={comment} />
      </div>
    </div>
  )
}

export default Comment
