import * as React from "react";
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

export function Navbar() {
  return (
    <NavigationMenu className="w-full border-b px-6 py-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
      </div>

      {/* Middle: Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-10" />
        </div>
      </div>

      {/* Right: NavigationMenu for Home dropdown and Avatar */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="min-w-[180px] p-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-accent rounded"
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-accent rounded"
                    >
                      Settings
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/support"
                      className="block px-4 py-2 hover:bg-accent rounded"
                    >
                      Support
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 hover:bg-accent rounded"
                    >
                      Logout
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Avatar className="h-8 w-8 cursor-pointer ml-4">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </NavigationMenu>
  );
}
