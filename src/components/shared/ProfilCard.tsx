import { useUserContext } from "@/context/AuthContext"
import { Link } from "react-router-dom"


const ProfilCard = () => {
  const { user } = useUserContext()


  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3 hover:darker">
          <Link to={`/profile/${user?.id}`}>
            <img
              src={user?.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="creator"
              className="rounded-full w-12 lg:h-12 "
            />
          </Link>


        </div>

      </div>

    </div>
  )
}

export default ProfilCard