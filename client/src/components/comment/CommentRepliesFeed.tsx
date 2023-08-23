import type { Comment } from "../../graphql/types"
import { getCommentFeedDocument } from "../../graphql/sharedDocuments"
import { useInfiniteQuery } from "@tanstack/react-query"
import { graphQLClient } from "../../utils/graphql"
import { ImSpinner11 } from "react-icons/im"
import { CommentReply } from "./CommentReply"

type CommentRepliesProps = {
  comment: Comment
}

const CommentReplies = ({ comment }: CommentRepliesProps) => {
  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["commentRepliesFeed", comment.id],
    ({ pageParam = undefined }) => {
      return graphQLClient.request(getCommentFeedDocument, {
        input: {
          filters: { parentId: comment.id },
          paginate: { first: 10, after: pageParam },
        },
      })
    },
    {
      getNextPageParam: (lastPage) => {
        console.log(lastPage.comments.pageInfo.endCursor)
        return lastPage.comments.pageInfo.endCursor
      },
    }
  )

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  }

  return (
    <div className="flex flex-col gap-1">
      {isSuccess &&
        data.pages.map((page) =>
          page.comments.edges.map((edge) => {
            return (
              <CommentReply
                key={edge.node.id}
                comment={edge.node}
                queryKey={["commentRepliesFeed", comment.id]}
              />
            )
          })
        )}
      {hasNextPage && (
        <button
          className="btn_blue w-fit flex text-sm py-[2px] px-2"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <ImSpinner11 className="animate-spin h-[14px] w-[14px]" />
          ) : (
            "Show more replies"
          )}
        </button>
      )}
    </div>
  )
}

export default CommentReplies