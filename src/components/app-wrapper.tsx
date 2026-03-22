import React from "react";
import AsideBar from "./aside-bar";

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <div className="h-full">
      <AsideBar />
      <main className="h-full pb-[calc(--spacing(16)+env(safe-area-inset-bottom))] md:pb-0 md:pl-16 lg:pl-60">
        {children}
      </main>
    </div>
  );
};

export default AppWrapper;
