/**
 * Represents the properties for the Datagrid component.
 *
 * @interface DatagridProps
 * @property {Question[]} datacontext - The list of questions to display in the data grid.
 * @property {(updatedData: Question[]) => void} onDataChange - Callback function triggered when the data is updated.
 * @property {number} changePage - The current page of the data grid.
 *
 * @example
 * const exampleDatagridProps: DatagridProps = {
 *   datacontext: [
 *     { name: "Question01_2024", category: "Geometry Questions", difficulty: "Difficult" },
 *     { name: "Question02_2024", category: "Algebra Questions", difficulty: "Easy" }
 *   ],
 *   onDataChange: (updatedData) => console.log("Data updated:", updatedData),
 *   changePage: 1
 * };
 */
export interface DatagridProps<T> {
  datacontext: T[];
  onOrderingChange?: (column: string) => void;
}

/**
 * Represents the properties for the Pagination component.
 *
 * @interface PaginationProps
 * @property {number} totalPages - The total number of pages available.
 * @property {number} currentPage - The currently active page.
 * @property {(page: number) => void} onPageChange - Callback function triggered when the page is changed.
 * @property {string} [className] - Optional CSS class names for styling the component.
 *
 * @example
 * const examplePaginationProps: PaginationProps = {
 *   totalPages: 10,
 *   currentPage: 1,
 *   onPageChange: (page) => console.log("Page changed to:", page),
 *   className: "flex text-lg"
 * };
 */
export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface OrderingItem {
  // dynamic field with 'order'; "" = without order
  [field: string]: "asc" | "desc" | "";
}

// Format sorting for Django's ordering format
// https://www.django-rest-framework.org/api-guide/filtering/#orderingfilter
export const orderingToString = (orderings: OrderingItem): string => {
  return Object.entries(orderings)
    .filter(([_, order]) => order !== "") // filter empty orders
    .map(([field, order]) => (order === "desc" ? `-${field}` : field))
    .join(",");
};

export const stringToOrdering = (orderingStr?: string): OrderingItem => {
  const orderings: OrderingItem = {};
  if (!orderingStr) return orderings;

  orderingStr.split(",").forEach((order) => {
    if (order.startsWith("-")) {
      orderings[order.slice(1)] = "desc"; // Remove "-" for descending order
    } else {
      orderings[order] = "asc"; // Default to ascending
    }
  });

  return orderings;
};
