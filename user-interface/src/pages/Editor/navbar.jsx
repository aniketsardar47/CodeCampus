import React, { useState } from "react";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-900 shadow-md z-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-10">
                    {/* 🔹 Logo Section */}
                    <div className="flex items-center">
                        <a href="/" className="block">
                            <img
                                src="mmcoe_logo.png"
                                alt="logo"
                                className="h-8 w-10 mt-4 dark:hidden"
                            />

                        </a>
                    </div>

                    {/* 🔹 Navigation Menu - Desktop */}
                    <nav className="hidden lg:flex space-x-8">
                        <ListItem NavLink="/">Home</ListItem>
                        <ListItem NavLink="/payment">Payment</ListItem>
                        <ListItem NavLink="/about">About</ListItem>
                        <ListItem NavLink="/blog">Blog</ListItem>
                    </nav>

                    {/* 🔹 Buttons Section */}
                    <div className="hidden lg:flex space-x-4">
                        <a href="/signin" className="text-gray-800 dark:text-white hover:text-gray-500">
                            Sign in
                        </a>
                        <a href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
                            Sign Up
                        </a>
                    </div>

                    {/* 🔹 Mobile Menu Button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="lg:hidden flex flex-col space-y-1 bg-transparent focus:outline-none"
                    >
                        <span className="block w-8 h-1 bg-gray-700 dark:bg-white"></span>
                        <span className="block w-8 h-1 bg-gray-700 dark:bg-white"></span>
                        <span className="block w-8 h-1 bg-gray-700 dark:bg-white"></span>
                    </button>
                </div>

                {/* 🔹 Mobile Navigation Menu */}
                {open && (
                    <nav className="lg:hidden bg-white dark:bg-gray-800 shadow-md rounded-md mt-2 p-4">
                        <ul className="space-y-4">
                            <ListItem NavLink="/">Home</ListItem>
                            <ListItem NavLink="/payment">Payment</ListItem>
                            <ListItem NavLink="/about">About</ListItem>
                            <ListItem NavLink="/blog">Blog</ListItem>
                            <hr className="border-gray-300 dark:border-gray-700" />
                            <div className="flex flex-col space-y-2">
                                <a href="/signin" className="text-gray-800 dark:text-white hover:text-gray-500">
                                    Sign in
                                </a>
                                <a href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 text-center">
                                    Sign Up
                                </a>
                            </div>
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Navbar;

const ListItem = ({ children, NavLink }) => {
    return (
        <li>
            <a
                href={NavLink}
                className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition duration-200 block"
            >
                {children}
            </a>
        </li>
    );
};
