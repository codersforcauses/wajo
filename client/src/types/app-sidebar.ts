import {
  BookType,
  FileJson,
  LucideIcon,
  SquareDashedMousePointer,
  UserRoundCog,
} from "lucide-react";

// Define the type for individual menu items
interface MenuItem {
  title: string;
  url: string;
}

// Define the type for menu sections (e.g., admin, teacher)
interface MenuSection {
  title: string;
  url: string;
  icon: LucideIcon;
  items: MenuItem[];
}

// Define the overall structure of the data object
interface NavigationData {
  admin: MenuSection[];
  teacher: MenuSection[];
  student: MenuSection[];
}

// Example usage of the type
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
