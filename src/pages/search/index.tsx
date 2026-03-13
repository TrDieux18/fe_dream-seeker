import EmptyState from "@/components/empty-state";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import UserItem from "@/components/user/user-item";
import { useSearch } from "@/hooks/use-search";
import FeedLayout from "@/layouts/feed-layout";
import { Search } from "lucide-react";
import { useEffect } from "react";

const SearchPage = () => {
  const { query, setQuery, searchUsers, results, isLoading } = useSearch();

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);
  };

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, searchUsers]);

  return (
    <FeedLayout showRightSidebar={false}>
      <div className="py-8 gap-y-3 flex flex-col items-center ">
        <InputGroup className="rounded-lg border-none bg-muted px-2 py-2 shadow-none h-12 ">
          <InputGroupAddon className="pl-0 text-muted-foreground">
            <Search
              className="text-muted-foreground"
              size={18}
              strokeWidth={2}
            />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search..."
            className="h-8 rounded-lg placeholder:text-muted-foreground "
            onChange={onSearchChange}
            value={query}
          />
        </InputGroup>
        <Separator />

        {/* Hiển thị trạng thái loading */}
        {isLoading && (
          <div className="text-muted-foreground flex items-center gap-2">
            <Spinner />
            Đang tìm kiếm...
          </div>
        )}

        {!isLoading && !query.trim() && (
          <EmptyState
            title="Start searching for users"
            description="Type a username or name to find users."
          />
        )}

        {/* Hiển thị kết quả */}
        {!isLoading && results.length > 0 && (
          <div className="w-full space-y-2">
            {results.map((user) => (
              <UserItem key={user._id} user={user} />
            ))}
          </div>
        )}

        {!isLoading && query.trim() && results.length === 0 && (
          <EmptyState
            title="No users found"
            description="Try adjusting your search or filter to find what you're looking for."
          />
        )}
      </div>
    </FeedLayout>
  );
};

export default SearchPage;
