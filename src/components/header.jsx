"use client";

import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const logout = () => {
    Cookies.remove("jwtToken");
    router.replace("/login");
  };
  return (
    <div className="border-b-[1px] flex justify-center items-center">
      <div className="flex flex-grow items-center p-4 max-w-[1200px]">
        <h1>Task Manager</h1>
        <div className="ml-auto flex items-center gap-2">
          {pathname === "/" && (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
