import {ReactNode, useState} from "react";
import { DrawerContext } from '../contexts/DrawerContext.ts';
interface SideDrawerProviderProps {
  children: ReactNode
}
export const DrawerProvider = ({children}: SideDrawerProviderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  return (
    <DrawerContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  )
};