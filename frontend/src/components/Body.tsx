import type { FC } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import { Outlet } from 'react-router'

const Body: FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex justify-center py-18">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body