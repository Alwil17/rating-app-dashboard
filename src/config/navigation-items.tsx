import {
  LayoutDashboard,
  Settings,
  UserCircle,
  Tags,
  FolderKanban,
  Boxes,
  UserCog,
  StarHalf,
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
        title: "Catégories",
        url: routes.admin.categories,
        icon: FolderKanban,
      },
      {
        title: "Tags",
        url: routes.admin.tags,
        icon: Tags,
      },
      {
        title: "Items",
        url: routes.admin.items,
        icon: Boxes,
      },
      {
        title: "Utilisateurs",
        url: routes.admin.users,
        icon: UserCog,
      },
      {
        title: "Évaluations",
        url: routes.admin.ratings,
        icon: StarHalf,
      }
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