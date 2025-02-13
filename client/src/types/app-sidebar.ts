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
  items?: MenuItem[]; // nested menu items
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
        { title: "Create Question", url: "/dashboard/question/create" },
        { title: "Question Bank", url: "/dashboard/question" },
      ],
    },
    {
      title: "Test Management",
      icon: BookType,
      items: [
        { title: "Practice Test", url: "/dashboard/test" },
        { title: "Competitions", url: "/dashboard/test/competition" },
        {
          title: "Results & Rankings",
          url: "/dashboard/test/leaderboard",
        },
      ],
    },
    {
      title: "User Management",
      icon: UserRoundCog,
      items: [
        { title: "Schools", url: "/dashboard/users/school" },
        {
          title: "Users",
          url: "/dashboard/users",
          items: [
            { title: "Teachers", url: "/dashboard/users/teachers" },
            { title: "Students", url: "/dashboard/users/students" },
            { title: "Staff", url: "/dashboard/users/staffs" },
          ],
        },
        { title: "Teams", url: "/dashboard/users/team" },
        { title: "Admin Portal", url: `${backendURL}admin`, isNewTab: true },
      ],
    },
  ],
  teacher: [
    {
      title: "Student Management",
      icon: UserRoundCog,
      items: [
        {
          title: "Students",
          url: "/dashboard/users/students",
        },
        { title: "Teams", url: "/dashboard/users/team" },
      ],
    },
  ],
  student: [
    // {
    //   title: "Student Menu",
    //   icon: SquareDashedMousePointer,
    //   items: [
    //     { title: "Student Menu Items 1", url: "#" },
    //     { title: "Student Menu Items 2", url: "#" },
    //   ],
    // },
  ],
};
