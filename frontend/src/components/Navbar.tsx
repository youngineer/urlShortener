import React from 'react'

const Navbar = () => {
  return (
    <div>
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">linkShrink</a>
            </div>
            <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                    <h5>logout</h5>
                </button>
            </div>
        </div>
    </div>
  )
}

export default Navbar