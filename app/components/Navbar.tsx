import { Link } from "@remix-run/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "app/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "app/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "app/components/ui/input";
import { Button } from "app/components/ui/button";

export function Navbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <nav className="w-full border-b px-6 py-4 flex items-center justify-between bg-white shadow-sm">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img src="/favicon.ico" alt="Logo" className="h-8 w-auto" />
      </div>

      {/* Middle: Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Right: NavigationMenu for Home dropdown, Auth buttons, and Avatar */}
      <div className="flex items-center gap-4">
        <NavigationMenu className="relative">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[180px]">
                <ul className="p-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        Dashboard
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        Settings
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/support"
                        className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors"
                      >
                        Support
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li className="border-t mt-1 pt-1">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/logout"
                        className="block px-4 py-2 hover:bg-gray-100 rounded transition-colors text-red-600"
                      >
                        Logout
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        {!isAuthenticated && (
          <>
            <Button asChild variant="outline">
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          </>
        )}
        <Link to="/profile">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="/favicon.ico" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
}
