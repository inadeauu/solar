import { useState } from "react"
import ProfilePostFeed from "./ProfilePostFeed"
import ProfileCommentFeed from "./ProfileCommentFeed"
import { User } from "../../../../graphql/types"
import ProfileCommunityFeed from "./ProfileCommunityFeed"

type ProfileFeedProps = {
  user: User
}

const TABS = ["Posts", "Comments", "Communities"]

const ProfileFeed = ({ user }: ProfileFeedProps) => {
  const [currentTab, setCurrentTab] = useState<string>("Posts")

  return (
    <div className="flex flex-col gap-5">
      <div
        data-testid="profile-feed-tabs"
        className="flex gap-5 bg-white px-4 py-2 border border-neutral-300 rounded-lg flex-wrap"
      >
        {TABS.map((tab) => (
          <div
            key={tab}
            className={`${
              tab == currentTab
                ? "border-b-[3px] border-blue-500 text-blue-500 cursor-default"
                : "hover:cursor-pointer hover:text-blue-500"
            }`}
            onClick={() => {
              if (tab == currentTab) return
              setCurrentTab(tab)
            }}
          >
            <span className="text-lg">{tab}</span>
          </div>
        ))}
      </div>
      {currentTab == "Posts" ? (
        <ProfilePostFeed user={user} />
      ) : currentTab == "Comments" ? (
        <ProfileCommentFeed user={user} />
      ) : (
        <ProfileCommunityFeed user={user} />
      )}
    </div>
  )
}

export default ProfileFeed
