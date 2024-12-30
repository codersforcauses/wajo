import {
  BookType,
  FileJson,
  LucideIcon,
  SquareDashedMousePointer,
  UserRoundCog,
} from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
}

interface MenuSection {
  title: string;
  url: string;
  icon: LucideIcon;
  items: MenuItem[];
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
      url: "#",
      icon: FileJson,
      items: [
        { title: "Create Question", url: "#" },
        { title: "Question Bank", url: "#" },
      ],
    },
    {
      title: "Test Management",
      url: "#",
      icon: BookType,
      items: [
        { title: "Practice Test", url: "#" },
        { title: "Competitions", url: "#" },
        { title: "Results & Rankings", url: "/leaderboard" },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: UserRoundCog,
      items: [
        { title: "Schools", url: "#" },
        { title: "Users", url: "#" },
        { title: "Teams", url: "#" },
      ],
    },
  ],
  teacher: [
    {
      title: "Teacher Menu",
      url: "#",
      icon: SquareDashedMousePointer,
      items: [
        { title: "Teacher Menu Items 1", url: "#" },
        { title: "Teacher Menu Items 2", url: "#" },
      ],
    },
  ],
  student: [
    {
      title: "Student Menu",
      url: "#",
      icon: SquareDashedMousePointer,
      items: [
        { title: "Student Menu Items 1", url: "#" },
        { title: "Student Menu Items 2", url: "#" },
      ],
    },
  ],
};
