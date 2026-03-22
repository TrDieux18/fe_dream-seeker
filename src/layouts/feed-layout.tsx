import type React from "react";

interface FeedLayoutProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
  showRightSidebar?: boolean;
}

const FeedLayout: React.FC<FeedLayoutProps> = ({
  children,
  rightSidebar,
  showRightSidebar = true,
}) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-400 justify-center bg-background px-0 sm:px-4 lg:px-6">
      {/* Main Feed Column */}
      <div
        className={`flex-1 ${
          showRightSidebar ? "max-w-157.5" : "max-w-233.75"
        } w-full min-w-0`}
      >
        {children}
      </div>

      {/* Right Sidebar - Hidden on mobile/tablet */}
      {showRightSidebar && rightSidebar && (
        <div className="hidden xl:block w-79.75 shrink-0 pl-6">
          <div className="sticky top-0 h-screen w-79.75 overflow-y-auto pt-8 pr-2">
            {rightSidebar}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedLayout;
