import {
  BookType,
  FileJson,
  LucideIcon,
  SquareDashedMousePointer,
  UserRoundCog,
} from "lucide-react";

import { backendURL } from "@/lib/api";

interface MenuItem {
  title: string;
  url: string; // need to be unique
  isActive?: boolean;
  isNewTab?: boolean;
}

interface MenuSection {
  title: string;
  // url: string;
  icon: LucideIcon;
  items: MenuItem[];
  isActive?: boolean;
}

interface NavigationData {
  admin: MenuSection[];
  teacher: MenuSection[];
  student: MenuSection[];
}

/**
 * The navigation data for different user roles (admin, teacher, student).
 * Each role has an array of sections, each section contains a title, URL,
 * associated icon, and menu items with titles and URLs.
 *
 * @type {NavigationData}
 */
export const navData: NavigationData = {
  admin: [
    {
      title: "Question Management",
      icon: FileJson,
      items: [
        { title: "Categories", url: "/question/category" },
        { title: "Create Question", url: "/question/create" },
        { title: "Question Bank", url: "/question" },
      ],
    },
    {
      title: "Test Management",
      icon: BookType,
      items: [
        { title: "Practice Test", url: "/test" },
        { title: "Competitions", url: "/test/competition" },
        { title: "Results & Rankings", url: "/test/leaderboard" },
      ],
    },
    {
      title: "User Management",
      icon: UserRoundCog,
      items: [
        { title: "Schools", url: "/users/school" },
        { title: "Users", url: "/users" },
        { title: "Teams", url: "/users/team" },
        { title: "Admin Portal", url: `${backendURL}admin`, isNewTab: true },
      ],
    },
  ],
  teacher: [
    {
      title: "User Management",
      icon: UserRoundCog,
      items: [
        { title: "Students", url: "/users" },
        { title: "Teams", url: "/users/team" },
      ],
    },
  ],
  student: [
    {
      title: "Student Menu",
      icon: SquareDashedMousePointer,
      items: [
        { title: "Student Menu Items 1", url: "#" },
        { title: "Student Menu Items 2", url: "#" },
      ],
    },
  ],
};
