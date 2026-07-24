import { Bell, Moon, Search, Sun, LogOut, User, BusFront, Menu } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "../../components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { useAuth } from "../../auth/context/AuthContext"
import { getInitials, translateRole } from "../../../shared/utils/helpers"
import { useDashboard } from "../../auth/context/DashBoardContext";

declare const __APP_VERSION__: string

export default function DashboardHeader() {
  const { userLogged, logout } = useAuth();

  const { theme, setTheme, setSidebarOpen } = useDashboard();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="flex items-center justify-between py-4 border-b border-border mb-4 md:mb-6">
      {/* Logo + Hamburger */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <BusFront className="h-7 w-7 md:h-8 md:w-8 text-accent-brand" />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Taquilla Demo
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/60 ml-9">v{__APP_VERSION__}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-2 md:space-x-6">
        {/* Search */}
        <div className="hidden md:flex items-center space-x-1 rounded-full px-3 py-1.5 border bg-muted/50 border-border backdrop-blur-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Notifications */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent-brand rounded-full animate-pulse"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notificaciones</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Theme */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cambiar tema</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Avatar + Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-muted text-accent-brand">
                    {getInitials(userLogged?.name || "")}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userLogged?.name}</span>
                  <span className="text-xs text-muted-foreground">{translateRole(userLogged?.role)}</span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
