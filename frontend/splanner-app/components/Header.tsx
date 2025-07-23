"use client";
import { useAuth } from "@/hooks/useAuth";
import { Button, DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";

export default function Header() {
  const { authenticated, logout } = useAuth();

  return (
    <Navbar fluid rounded className="bg-gray-200">
      <NavbarBrand href="/">
        <img src="/splanner.svg" alt="Splanner Logo" className="mr-3 h-6 sm:h-9" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-black">Splanner</span>
      </NavbarBrand>

      <div className="flex md:order-2">
        {authenticated && (
          <Button
            onClick={logout}
            aria-label="Logout"
            className="mr-2 dark:text-white text-black hover:bg-gray-100 bg-transparent dark:bg-transparent dark:hover:bg-gray-900"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
              />
            </svg>
          </Button>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse className="md:flex-row md:items-center md:gap-6">
        {authenticated ? (
          <ul className="flex flex-col md:flex-row md:items-center md:gap-6">
            <NavbarLink href="/dashboard">Dashboard</NavbarLink>
            <NavbarLink href="/tasks">Tasks</NavbarLink>
            <NavbarLink href="/courses">Courses</NavbarLink>
            <NavbarLink href="/notes">Notes</NavbarLink>
          </ul>
        ) : null}

        <div className={`flex items-center ${authenticated ? "md:ml-4" : "justify-center w-full"}`}>
          <DarkThemeToggle className="scale-90" />
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}
