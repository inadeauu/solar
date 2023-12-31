import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import NavProfile from "./NavProfile"
import SearchBar from "../searchbar/SearchBar"
import NavUnauth from "./NavUnauth"
import { AiOutlineHome } from "react-icons/ai"

const Navbar = () => {
  const { user } = useAuth()

  return (
    <header className="border-b border-neutral-300 bg-white h-16 sticky top-0 z-[1000]">
      <nav
        data-testid="navbar"
        className="flex mx-auto items-center max-w-4xl justify-between h-full xs:px-4 xs-max:px-2 gap-6"
      >
        <Link to="/" className="text-3xl font-semibold xs-max:hidden">
          Solar
        </Link>
        <Link to="/" className="xs:hidden">
          <AiOutlineHome className="w-8 h-8" />
        </Link>
        <SearchBar />
        {!user ? <NavUnauth /> : <NavProfile />}
      </nav>
    </header>
  )
}

export default Navbar
