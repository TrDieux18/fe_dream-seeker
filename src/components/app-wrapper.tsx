import React from "react";
import AsideBar from "./aside-bar";

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <div className="h-full">
      <AsideBar />
      <main className="md:pl-16 lg:pl-60 pb-16 md:pb-0 h-full">{children}</main>
    </div>
  );
};

export default AppWrapper;
