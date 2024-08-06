import { SIDEBAR_LINKS } from '@/constants'
import { useUserContext } from '@/context/AuthContext'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { INavLink } from '@/types'
import { useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'


const LeftSidebar = () => {
  const { pathname } = useLocation()
  const { user } = useUserContext()
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) navigate(0)

  }, [isSuccess])

  return (
    <nav className='leftsidebar'>
      <div className="flex flex-col gap-11">
        <Link to={"/"} className='flex gap-3 items-center justify-center'>
          <img
            src='/assets/image/logo.png'
            alt='logo'
            width={40}
            height={40}
          />
        </Link>

        <Link to={`/profile/${user?.id}`}
          className='flex gap-3 items-center'
        >
          <img
            src={user?.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="profile"
            className='h-10 w-10 rounded-full'
          />
          <div className='flex flex-col'>
            <p className='body-bold max-w-52 line-clamp-1'>
              {user?.name}
            </p>

            <p className='small-regular text-light-3'>
              @{user?.username}
            </p>
          </div>
        </Link>

        <ul className='flex flex-col gap-1'>
          {SIDEBAR_LINKS.map((link: INavLink) => {
            let isActive = pathname === link.route

            return <li
              key={link.label}
              className={`leftsidebar-link group 
                ${isActive && 'bg-primary-500'}`}
            >
              <NavLink
                to={link.route}
                className="flex gap-4 items-center p-4"
              >
                <img
                  src={link.imgURL}
                  alt={link.label}
                  className={
                    `group-hover:invert-white h-5 w-5
                    ${isActive && 'invert-white'} `}
                />
                {link.label}
              </NavLink>
            </li>
          })}

        </ul>
      </div>
      <Button
        variant={"ghost"}
        className='shad-button_ghost group leftsidebar-link hover:invert-dark'
        onClick={() => signOut()}
      >
        <img
          src='/assets/icons/logout.svg'
          alt='logout'
          className={
            `group-hover:invert-white h-5 w-5`}
        />
        <p className='small-medium lg:base-medium'>
          Logout
        </p>
      </Button>
    </nav>
  )
}

export default LeftSidebar