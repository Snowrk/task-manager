"use client";

import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const Header = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const logout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("username");
    router.replace("/login");
  };
  useEffect(() => {
    setUsername(Cookies.get("username"));
  }, []);
  return (
    <div className="border-b-[1px] flex justify-center items-center">
      <div className="flex flex-grow items-center p-4 max-w-[1200px]">
        <div className="flex items-center gap-1">
          <Image width={40} height={40} src="/task.png" alt="logo" />
          <h1>Task Manager</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              {username ? `${username[0]}${username[1]}` : "0"}
            </AvatarFallback>
          </Avatar>

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
