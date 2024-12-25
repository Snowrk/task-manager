"use client";

import { ModeToggle } from "./mode-toggle";

const Header = () => {
  return (
    <div className="border-b-2 flex justify-center items-center">
      <div className="flex justify-between flex-grow items-center p-4 max-w-[1200px]">
        <h1>Task Manager</h1>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
