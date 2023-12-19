import {IconAddGuest, IconPeople, IconPlacementGuets} from "./Icons.tsx";
import {NavLink, useLocation, useParams} from "react-router-dom";
import {ReactNode, useState} from "react";

interface NavButtons {
  id: number,
  icon: ReactNode,
  to: string
}
// {id: 1, icon: <IconHouse />, to: `/${eventId}/admin`},

const BottomNavigationAdmin = () => {
  const location = useLocation();
  const {eventId} = useParams();
  const [navButtons] = useState<NavButtons[]>([
    {id: 2, icon: <IconPeople size="6" />, to: `/admin/${eventId}/guests-list`},
    {id: 3, icon: <IconAddGuest />, to: `/admin/${eventId}/add-guest`},
    {id: 4, icon: <IconPlacementGuets />, to: `/admin/${eventId}/guests-placement`},
  ]);

  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  return (
    <div
      className="fixed z-30 w-full h-14 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-0 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="justify-center flex h-full max-w-lg grid-cols-5 mx-auto">

        { navButtons.map(navButton => (
            <NavLink key={navButton.id} to={navButton.to} className={`btn-bottom-nav ${isActive(navButton.to) ? 'active-nav': ''}`}>
              {navButton.icon}
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}

export default BottomNavigationAdmin;