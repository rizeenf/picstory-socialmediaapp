import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) navigate(0)

  }, [isSuccess])

  console.log(user, 'user')
  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link to={"/"} className='flex gap-3 items-center'>
          <img
            src='/assets/image/logo.png'
            alt='logo'
            width={30}
            height={50}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant={"ghost"}
            className='shad-button_ghost hover:invert-dark'
            onClick={() => signOut()}
          >
            <img
              src='/assets/icons/logout.svg'
              alt='logout'
              className='h-5 w-5'
            />
          </Button>

          <Link to={`/profile/${user?.id}`} className='flex-center gap-3'>

            <img
              src={user?.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt='profile'
              className='h-7 w-7 rounded-full'
            />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Topbar