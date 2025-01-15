import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RoleEnum } from "@/types/user";

type Props = {
  selectedRole: string | undefined;
  onChange: (role: string) => void;
  className?: string;
};

/**
 * Renders a dropdown for selecting a user role.
 *
 * @description
 * This component provides a customizable dropdown for selecting a role. It is designed to work with the `RoleEnum` enum, dynamically rendering role options.
 *
 * @param {Object} props - The component props.
 * @param {string | undefined} props.selectedRole - The currently selected role.
 * @param {Function} props.onChange - Callback function triggered when the selected role changes.
 * @param {string} [props.className] - Optional additional class names for the select trigger.
 *
 * @example
 * <FormField
 *   control={formControl}
 *   name="userRole"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormControl>
 *         <SelectRole
 *           selectedRole={field.value}
 *           onChange={field.onChange}
 *           className="w-full"
 *         />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 */
export function SelectRole({ selectedRole, onChange, className }: Props) {
  const onValueChange = (value: string) => {
    onChange(value);
  };

  return (
    <Select
      value={selectedRole ? selectedRole.toString() : ""}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        {RoleEnum.options.map((role) => (
          <SelectItem key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
