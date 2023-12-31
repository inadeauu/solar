import { useRef, useState } from "react"
import { CiLogout } from "react-icons/ci"
import useClickOutside from "../../hooks/useClickOutside"
import { BsHouseAdd, BsPerson } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { graphql } from "../../graphql_codegen/gql"
import { graphQLClient } from "../../utils/graphql"
import { useAuth } from "../../hooks/useAuth"
import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/Ri"
import { CiSettings } from "react-icons/ci"
import { AuthUserQuery } from "../../graphql_codegen/graphql"
import { CgProfile } from "react-icons/cg"

const logoutDocument = graphql(/* GraphQL */ `
  mutation Logout {
    logout {
      ... on LogoutSuccess {
        __typename
        successMsg
        code
      }
    }
  }
`)

const NavProfile = () => {
  const { user } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const logout = useMutation({
    mutationFn: async () => {
      return graphQLClient.request(logoutDocument)
    },
    onSuccess: (data) => {
      if (data.logout.__typename == "LogoutSuccess") {
        queryClient.setQueryData<AuthUserQuery>(["authUser"], (oldData) =>
          oldData ? { ...oldData, authUser: { ...oldData.authUser, user: null } } : oldData
        )
        navigate("/")
      }
    },
  })

  useClickOutside(menuRef, () => {
    if (openMenu) {
      setOpenMenu((prev) => !prev)
    }
  })

  return (
    <div
      data-testid="nav-profile-menu-container"
      ref={menuRef}
      className="relative"
      onClick={() => setOpenMenu((prev) => !prev)}
    >
      <div
        className={`bg-white border border-neutral-300 hover:border-neutral-400 rounded-md pl-2 pr-1 py-1 hover:cursor-pointer flex items-center justify-between ${
          openMenu && "border-neutral-400"
        }`}
      >
        <BsPerson className="w-7 h-7 hover:cursor-pointer sm:hidden" />
        <span data-testid="nav-profile-username" className="text-[12px] font-semibold sm-max:hidden">
          {user?.username}
        </span>
        <span className="pointer-events-none">
          {openMenu ? <RiArrowDropUpLine className="w-6 h-6" /> : <RiArrowDropDownLine className="w-6 h-6" />}
        </span>
      </div>
      {openMenu && (
        <div
          data-testid="nav-profile-menu"
          className="absolute right-0 top-11 bg-white w-[200px] border border-neutral-300 rounded-md text-sm font-medium"
        >
          <Link
            data-testid="profile-button"
            to={`/profile/${user?.username}`}
            className="flex items-center gap-2 p-2 rounded-t-md hover:bg-neutral-200 hover:cursor-pointer"
          >
            <div className="w-[15%]">
              <CgProfile className="h-5 w-5" />
            </div>
            Profile
          </Link>
          <Link
            data-testid="create-community-button"
            to="/create-community"
            className="flex items-center gap-2 p-2 hover:bg-neutral-200 hover:cursor-pointer"
          >
            <div className="w-[15%]">
              <BsHouseAdd className="h-5 w-5" />
            </div>
            Create a Community
          </Link>
          <Link
            data-testid="settings-button"
            to={`/settings`}
            className="flex items-center gap-2 p-2 hover:bg-neutral-200 hover:cursor-pointer"
          >
            <div className="w-[15%]">
              <CiSettings className="h-6 w-6" />
            </div>
            Settings
          </Link>
          <div
            data-testid="logout-button"
            className="flex items-center gap-2 p-2 rounded-b-md hover:bg-neutral-200 hover:cursor-pointer"
            onClick={() => logout.mutate()}
          >
            <div className="w-[15%]">
              <CiLogout className="h-5 w-5" />
            </div>
            Log Out
          </div>
        </div>
      )}
    </div>
  )
}

export default NavProfile
