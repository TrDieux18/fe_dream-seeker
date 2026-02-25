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
    <div className="flex justify-center min-h-screen bg-background">
      {/* Main Feed Column */}
      <div
        className={`flex-1 ${
          showRightSidebar ? "max-w-157.5" : "max-w-233.75"
        } w-full`}
      >
        {children}
      </div>

      {/* Right Sidebar - Hidden on mobile/tablet */}
      {showRightSidebar && rightSidebar && (
        <div className="hidden xl:block w-79.75 shrink-0">
          <div className="fixed w-79.75 pt-8 pr-16">{rightSidebar}</div>
        </div>
      )}
    </div>
  );
};

export default FeedLayout;
