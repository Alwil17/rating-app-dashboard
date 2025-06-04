import {
  LayoutDashboard,
  Users,
  Star,
  Settings,
  UserCircle,
  BarChart3,
  List,
} from 'lucide-react';
import { routes } from './routes';

export interface NavMenuItem {
  title: string;
  url: string;
  icon: any;
}

export interface NavMenuGroup {
  title: string;
  items: NavMenuItem[];
}

export const mainNavigation: NavMenuGroup[] = [
  {
    title: "Administration",
    items: [
      {
        title: "Dashboard",
        url: routes.admin.home,
        icon: LayoutDashboard,
      },
      {
        title: "Items",
        url: routes.admin.items,
        icon: List,
      },
      {
        title: "Utilisateurs",
        url: routes.admin.users,
        icon: Users,
      },
      {
        title: "Catégories",
        url: routes.admin.categories,
        icon: List,
      },
      {
        title: "Statistiques",
        url: routes.admin.ratings,
        icon: BarChart3,
      },
      {
        title: "Évaluations",
        url: routes.admin.ratings,
        icon: Star,
      },
    ],
  },
  {
    title: "Paramètres",
    items: [
      {
        title: "Mon Profil",
        url: routes.admin.profile,
        icon: UserCircle,
      },
      {
        title: "Configuration",
        url: routes.admin.settings,
        icon: Settings,
      },
    ],
  },
]; 