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
