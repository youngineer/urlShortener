import type { FC, JSX } from "react";
import Footer from './Footer'
import NavbarTop from './Navbar'
import { Outlet } from 'react-router'

const Body: FC = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarTop />
      <main className="flex-1 justify-center py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body