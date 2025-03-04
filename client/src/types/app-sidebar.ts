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
        { title: "Categories", url: "/dashboard/question/category" },
        { title: "Question Bank", url: "/dashboard/question" },
      ],
    },
    {
      title: "Test Management",
      icon: BookType,
      items: [
        { title: "Practice Test", url: "/dashboard/test" },
        { title: "Competitions", url: "/dashboard/test/competition" },
        { title: "Results & Rankings", url: "/dashboard/test/leaderboard" },
        { title: "Insights", url: "/dashboard/test/insights" },
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
        { title: "Students", url: "/dashboard/users/students" },
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

// Find best matching URL at the same menu level
const findBestMatchAtLevel = (
  items: MenuItem[],
  currentPath: string,
): string | null => {
  // Sort items by URL length descending to get most specific match first
  const sortedItems = [...items].sort((a, b) => b.url.length - a.url.length);

  // Find the longest matching URL at this level
  const match = sortedItems.find((item) => currentPath.startsWith(item.url));
  return match?.url || null;
};

// Process items based on matching strategy
const processMenuItems = (
  items: MenuItem[],
  currentPath: string,
): MenuItem[] => {
  // Find the best match at this level
  const bestMatchUrl = findBestMatchAtLevel(items, currentPath);

  return items.map((item) => {
    // Item is active if it's the best match at this level
    const isActiveAtThisLevel = item.url === bestMatchUrl;

    // Process nested items if they exist
    let nestedItems: MenuItem[] | undefined;
    if (item.items) {
      // Only process nested items if this is the active parent
      if (currentPath.startsWith(item.url)) {
        nestedItems = processMenuItems(item.items, currentPath);
      } else {
        nestedItems = item.items.map((subItem) => ({
          ...subItem,
          isActive: false,
        }));
      }
    }

    return {
      ...item,
      isActive: isActiveAtThisLevel,
      items: nestedItems,
    };
  });
};

// Main function to process the menu sections
const processMenuSections = (
  sections: MenuSection[],
  currentPath: string,
): MenuSection[] => {
  return sections.map((section) => {
    const processedItems = processMenuItems(section.items, currentPath);
    const hasActiveItem = processedItems.some((item) => item.isActive);

    return {
      ...section,
      isActive: hasActiveItem,
      items: processedItems,
    };
  });
};

export const updateSidebarMenu = (
  sections: MenuSection[],
  currentPath: string,
): MenuSection[] => {
  const normalizedPath = currentPath.replace(/\/$/, "");
  return processMenuSections(sections, normalizedPath);
};
