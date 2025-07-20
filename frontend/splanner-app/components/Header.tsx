"use client";
import { useLogout } from "@/hooks/useLogout";
import { useAuth } from "@/hooks/useAuth";
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";

export default function Header() {
  const logout = useLogout();
  const { authenticated } = useAuth();

  return (
    <header>
        <Navbar fluid rounded>
            <NavbarBrand href="/">
                <img src="/splanner.svg" alt="Splanner Logo" className="mr-3 h-6 sm:h-9" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Splanner</span>
            </NavbarBrand>
            <div className="flex md:order-2">
            {authenticated && (
                <Button onClick={logout} aria-label="Logout" className="mr-2">
                Logout
                </Button>
            )}
            <NavbarToggle />
            </div>
            <NavbarCollapse>
            {authenticated && (
                <>
                <NavbarLink href="/dashboard">Dashboard</NavbarLink>
                <NavbarLink href="/tasks">Tasks</NavbarLink>
                <NavbarLink href="/courses">Courses</NavbarLink>
                <NavbarLink href="/notes">Notes</NavbarLink>
                </>
            )}
            </NavbarCollapse>
        </Navbar>
    </header>
  );
}
