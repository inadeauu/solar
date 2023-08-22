import { Navigate, useParams } from "react-router-dom"
import { translator } from "../utils/uuid"
import { ImSpinner11 } from "react-icons/im"
import CommunitySidebar from "../components/community/CommunitySidebar"
import CommunityPostFeed from "../components/community/CommunityPostFeed"
import CommunityPostForm from "../components/community/CommunityPostForm"
import CommunityHeader from "../components/community/CommunityHeader"
import { useCommunity } from "../graphql/useQuery"

const CommunityPage = () => {
  const { title, id } = useParams()
  const { data, isLoading } = useCommunity(translator.toUUID(id!))

  if (isLoading) {
    return <ImSpinner11 className="animate-spin h-12 w-12" />
  } else if (!data?.community || data.community.title !== title) {
    return <Navigate to="/404-not-found" />
  }

  return (
    <section className="flex gap-6">
      <div className="flex flex-col gap-5 md:grow md-max:w-full">
        <CommunityHeader community={data.community} />
        <CommunityPostForm community={data.community} />
        <CommunityPostFeed community={data.community} />
      </div>
      <CommunitySidebar community={data.community} />
    </section>
  )
}

export default CommunityPage
