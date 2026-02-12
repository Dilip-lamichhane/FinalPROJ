import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  Package, 
  MessagesSquare, 
  Settings, 
  ShieldCheck, 
  Bug, 
  HelpCircle,
  ChevronsUpDown,
  LogOut,
  Bell,
  CreditCard,
  BadgeCheck,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// UI Components replicated from shadcn-admin
const Card = ({ className = '', children, ...props }) => (
  <div
    className={`flex flex-col gap-6 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 py-6 text-gray-900 dark:text-white shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children, ...props }) => (
  <div className={`leading-none font-semibold text-lg text-gray-900 dark:text-white ${className}`} {...props}>
    {children}
  </div>
);

const CardDescription = ({ className = '', children, ...props }) => (
  <div className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className = '', children, ...props }) => (
  <div className={`px-6 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  asChild = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";
  
  const variants = {
    default: 'bg-blue-600 text-white shadow-xs hover:bg-blue-600/90',
    destructive: 'bg-red-600 text-white shadow-xs hover:bg-red-600/90',
    outline: 'border bg-white dark:bg-gray-800 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-xs hover:bg-gray-100/80 dark:hover:bg-gray-800/80',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
    link: 'text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline',
  };
  
  const sizes = {
    default: 'h-9 px-4 py-2 has-[>svg]:px-3',
    sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
    lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
    icon: 'size-9',
  };
  
  const Comp = asChild ? 'div' : 'button';
  
  return (
    <Comp
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
};

// Sidebar Data
const sidebarData = {
  user: {
    name: 'Admin User',
    email: 'admin@khojhub.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'KhojHub Admin',
      logo: null,
      plan: 'Enterprise',
    },
    {
      name: 'Development',
      logo: null,
      plan: 'Team',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: LayoutDashboard,
        },
        {
          title: 'Users',
          url: '/admin/users',
          icon: Users,
        },
        {
          title: 'Shops',
          url: '/admin/shops',
          icon: Package,
        },
        {
          title: 'Messages',
          url: '/admin/messages',
          badge: '3',
          icon: MessagesSquare,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Authentication',
          icon: ShieldCheck,
          items: [
            {
              title: 'Login',
              url: '/admin/auth/login',
            },
            {
              title: 'Register',
              url: '/admin/auth/register',
            },
          ],
        },
        {
          title: 'Error Pages',
          icon: Bug,
          items: [
            {
              title: '404 Error',
              url: '/admin/errors/404',
            },
            {
              title: '500 Error',
              url: '/admin/errors/500',
            },
          ],
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          url: '/admin/settings',
          icon: Settings,
        },
        {
          title: 'Help Center',
          url: '/admin/help',
          icon: HelpCircle,
        },
      ],
    },
  ],
};

// Sidebar Components
const SidebarMenuButton = ({ children, isActive = false, onClick, tooltip, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    } ${className}`}
    title={tooltip}
    {...props}
  >
    {children}
  </button>
);

const SidebarMenuItem = ({ children, className = '', ...props }) => (
  <li className={`list-none ${className}`} {...props}>
    {children}
  </li>
);

const SidebarMenu = ({ children, className = '', ...props }) => (
  <ul className={`space-y-1 ${className}`} {...props}>
    {children}
  </ul>
);

const SidebarGroup = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

const SidebarGroupLabel = ({ children, className = '', ...props }) => (
  <h3 className={`px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`} {...props}>
    {children}
  </h3>
);

const SidebarMenuSub = ({ children, className = '', ...props }) => (
  <ul className={`ml-4 mt-1 space-y-1 ${className}`} {...props}>
    {children}
  </ul>
);

const SidebarMenuSubItem = ({ children, className = '', ...props }) => (
  <li className={`list-none ${className}`} {...props}>
    {children}
  </li>
);

const SidebarMenuSubButton = ({ children, isActive = false, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
      isActive 
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Collapsible = ({ children, defaultOpen = false, className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={className} {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const CollapsibleTrigger = ({ children, isOpen, setIsOpen, className = '', ...props }) => {
  const { asChild, ...domProps } = props;
  return (
    <div onClick={() => setIsOpen(!isOpen)} className={`cursor-pointer ${className}`} {...domProps}>
      {children}
    </div>
  );
};

const CollapsibleContent = ({ children, isOpen, className = '', ...props }) => {
  if (!isOpen) return null;
  const { asChild, ...domProps } = props;
  return (
    <div className={className} {...domProps}>
      {children}
    </div>
  );
};

const NavUser = ({ user, isOpen: parentIsOpen, setIsOpen: parentSetIsOpen, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSidebarCollapsed } = useTheme();
  
  // Use local state, ignore parent props if they exist
  const localIsOpen = parentIsOpen !== undefined ? parentIsOpen : isOpen;
  const localSetIsOpen = parentSetIsOpen !== undefined ? parentSetIsOpen : setIsOpen;
  
  // Filter out any remaining custom props
  const { asChild, ...domProps } = props;
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="relative">
        <button
          onClick={() => localSetIsOpen(!localIsOpen)}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isSidebarCollapsed ? user.name : undefined}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!isSidebarCollapsed && (
            <div className="flex-1 text-start transition-opacity duration-200">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          )}
          {!isSidebarCollapsed && <ChevronsUpDown className="h-4 w-4 text-gray-400" />}
        </button>
        
        {localIsOpen && !isSidebarCollapsed && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BadgeCheck className="h-4 w-4" />
              Account
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <CreditCard className="h-4 w-4" />
              Billing
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TeamSwitcher = ({ teams }) => {
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [isOpen, setIsOpen] = useState(false);
  const { isSidebarCollapsed } = useTheme();
  
  return (
    <div className="mb-4">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isSidebarCollapsed ? selectedTeam.name : undefined}
        >
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 text-start transition-opacity duration-200">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedTeam.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTeam.plan}</p>
            </div>
          )}
          {!isSidebarCollapsed && <ChevronsUpDown className="h-4 w-4 text-gray-400" />}
        </button>
        
        {isOpen && !isSidebarCollapsed && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
            {teams.map((team, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTeam(team);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">K</span>
                </div>
                <div className="flex-1 text-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{team.plan}</p>
                </div>
                {selectedTeam.name === team.name && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NavGroup = ({ title, items }) => {
  const location = useLocation();
  const { isSidebarCollapsed } = useTheme();
  
  const checkIsActive = (href, item, mainNav = false) => {
    return (
      href === item.url ||
      href.split('?')[0] === item.url ||
      !!item?.items?.filter((i) => i.url === href).length ||
      (mainNav &&
        href.split('/')[1] !== '' &&
        href.split('/')[1] === item?.url?.split('/')[1])
    );
  };
  
  return (
    <SidebarGroup>
      {!isSidebarCollapsed && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`;
          
          if (!item.items) {
            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton
                  isActive={checkIsActive(location.pathname, item)}
                  onClick={() => window.location.href = item.url}
                  tooltip={isSidebarCollapsed ? item.title : undefined}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {!isSidebarCollapsed && <span className="transition-opacity duration-200">{item.title}</span>}
                  {item.badge && !isSidebarCollapsed && (
                    <Badge variant="default" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
          
          return (
            <Collapsible
              key={key}
              defaultOpen={checkIsActive(location.pathname, item, true)}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={checkIsActive(location.pathname, item, true)}
                    tooltip={isSidebarCollapsed ? item.title : undefined}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {!isSidebarCollapsed && <span className="transition-opacity duration-200">{item.title}</span>}
                    {item.badge && !isSidebarCollapsed && (
                      <Badge variant="default" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                    {!isSidebarCollapsed && <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={`${subItem.title}-${subItem.url}`}>
                        <SidebarMenuSubButton
                          isActive={checkIsActive(location.pathname, subItem)}
                          onClick={() => window.location.href = subItem.url}
                        >
                          {subItem.icon && <subItem.icon className="h-4 w-4" />}
                          {!isSidebarCollapsed && <span className="transition-opacity duration-200">{subItem.title}</span>}
                          {subItem.badge && !isSidebarCollapsed && (
                            <Badge variant="default" className="ml-auto">
                              {subItem.badge}
                            </Badge>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

// Error notification component
  const ErrorNotification = ({ message, onClose }) => (
    <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start">
        <div className="shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-red-800">Error</p>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
        <div className="ml-4 shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const Sidebar = ({ children, isCollapsed = false, className = '', ...props }) => (
  <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
    isCollapsed ? 'w-16' : 'w-64'
  } ${className}`} {...props}>
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  </aside>
);

const Tabs = ({ defaultValue, children, className = '', ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className={className} {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, className = '', ...props }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`} {...props}>
    {children}
  </div>
);

const TabsTrigger = ({ value, children, activeTab, setActiveTab, className = '', ...props }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value 
        ? 'bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-sm' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab, className = '', ...props }) => {
  if (activeTab !== value) return null;
  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

const Avatar = ({ className = '', children, ...props }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className = '', ...props }) => (
  <img className={`aspect-square h-full w-full ${className}`} src={src} alt={alt} {...props} />
);

const AvatarFallback = ({ children, className = '', ...props }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-sm ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ variant = 'default', className = '', children, ...props }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-100/80',
    destructive: 'bg-red-100 text-red-800 hover:bg-red-100/80',
    outline: 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Data definitions moved before component
const chartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
  { name: 'Aug', revenue: 6500 },
  { name: 'Sep', revenue: 8000 },
  { name: 'Oct', revenue: 7500 },
  { name: 'Nov', revenue: 9000 },
  { name: 'Dec', revenue: 8500 }
];

const pieData = [
  { name: 'Desktop', value: 400, color: '#3B82F6' },
  { name: 'Mobile', value: 300, color: '#10B981' },
  { name: 'Tablet', value: 200, color: '#F59E0B' },
  { name: 'Other', value: 100, color: '#EF4444' }
];

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Total Users',
    value: '23,456',
    change: '+12.5% from last month',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Total Sales',
    value: '1,234',
    change: '+8.2% from last month',
    trend: 'up',
    icon: ShoppingCart,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    title: 'Active Now',
    value: '573',
    change: '+201 since last hour',
    trend: 'up',
    icon: Activity,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
];

const recentSales = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' }
];

// Admin Portal Component
const AdminPortal = () => {
  const { user } = useUser();
  const { theme, toggleTheme, isSidebarCollapsed, toggleSidebar, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [offset, setOffset] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [statsData, setStatsData] = useState(stats);
  const [error, setError] = useState(null);

  // Debug effect to monitor theme changes
  useEffect(() => {
    console.log('AdminPortal - Current theme:', theme);
    console.log('AdminPortal - Document classes:', document.documentElement.classList.toString());
    console.log('AdminPortal - isDark:', isDark);
  }, [theme, isDark]);

  // Mock API functions with error handling
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to fetch users. Please try again.');
      }
      
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
      // Fallback: show cached data after error
      setTimeout(() => {
        setUsers(usersData);
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate random error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Failed to fetch statistics. Please try again.');
      }
      
      setStatsData(stats);
    } catch (err) {
      setError(err.message);
      // Fallback: show cached data after error
      setTimeout(() => {
        setStatsData(stats);
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dummy data for admin dashboard (using external data definitions)

  // Dummy data for users table
  const usersData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 hours ago',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'User',
      status: 'Active',
      lastActive: '5 minutes ago',
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'User',
      status: 'Inactive',
      lastActive: '3 days ago',
      avatar: 'BJ'
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      role: 'Moderator',
      status: 'Active',
      lastActive: '1 hour ago',
      avatar: 'AB'
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com',
      role: 'User',
      status: 'Active',
      lastActive: '30 minutes ago',
      avatar: 'CW'
    }
  ];

  const topNav = [
    { title: 'Overview', href: 'overview', isActive: activeTab === 'overview' },
    { title: 'Analytics', href: 'analytics', isActive: activeTab === 'analytics' },
    { title: 'Users', href: 'users', isActive: activeTab === 'users' },
    { title: 'Shops', href: 'shops', isActive: activeTab === 'shops' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Error Notification */}
      {error && (
        <ErrorNotification 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <TeamSwitcher teams={sidebarData.teams} />
            
            {sidebarData.navGroups.map((group) => (
              <NavGroup key={group.title} title={group.title} items={group.items} />
            ))}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <NavUser user={sidebarData.user} />
          </div>
        </div>
      </Sidebar>
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Header */}
        <header
          className={`z-30 h-16 sticky top-0 w-full transition-shadow bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${
            offset > 10 ? 'shadow-sm' : ''
          }`}
        >
          <div className="relative flex h-full items-center gap-3 p-4 sm:gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Sidebar toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {activeTab === 'overview' && 'Dashboard'}
                {activeTab === 'users' && 'Users'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'shops' && 'Shops'}
              </h1>
            </div>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-64"
                />
              </div>
              
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full"
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Export</Button>
            <Button>Download Report</Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {topNav.map((item) => (
                <button
                  key={item.href}
                  onClick={() => setActiveTab(item.href)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    item.isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {loading ? (
                // Loading skeleton for stats cards
                [1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-6 sm:h-8 bg-gray-200 rounded w-24 sm:w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32 sm:w-48"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                statsData.map((stat, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="flex items-center mt-1">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1" />
                        )}
                        <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Charts and Recent Sales */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue trends for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#3b82f6" 
                          fill="url(#colorRevenue)" 
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {recentSales.map((sale, index) => (
                      <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {sale.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sale.name}</p>
                          <p className="text-sm text-gray-500 truncate">{sale.email}</p>
                        </div>
                        <div className="text-sm font-medium text-green-600 whitespace-nowrap">
                          {sale.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Distribution of user traffic by device</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-linear-to-br from-purple-50 to-pink-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-500">Advanced Analytics Dashboard</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Add New User
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage your application users</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {/* Loading skeleton */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-48"></div>
                        </div>
                        <div className="w-16 h-6 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Last Active</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarFallback className="bg-blue-100 text-blue-700">
                                    {user.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {user.lastActive}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  Edit
                                </button>
                                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shops Tab */}
        {activeTab === 'shops' && (
          <Card>
            <CardHeader>
              <CardTitle>Shop Management</CardTitle>
              <CardDescription>Manage platform shops and businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Shops</span>
                  <Badge variant="default">2,847</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Shops</span>
                  <Badge variant="secondary">2,156</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Shops This Week</span>
                  <Badge variant="default">+23</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;