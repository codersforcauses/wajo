import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Form components using `react-hook-form` for managing form state and validation, along with custom form field components.
 *
 * @see {@link https://ui.shadcn.com/docs/components/form} for more details.
 *
 * @component
 * @example
 * <Form {...formMethods}>
 *   <form id="some_form_id" onSubmit={formMethods.handleSubmit(onSubmit)}>
 *     <FormField
 *       control={formMethods.control}
 *       name="username"
 *       render={({ field }) => (
 *         <FormItem className="flex flex-col gap-2">
 *           <FormLabel>Username</FormLabel>
 *           <FormControl>
 *             <Input {...field}/>
 *           </FormControl>
 *           <FormMessage />
 *         </FormItem>
 *       )}
 *     />
 *     <Button type="submit">
 *       Submit
 *     </Button>
 *   </form>
 * </Form>
 */
const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

/**
 * Form context provider for a specific field.
 * Provides context for form fields to manage field-specific state and error handling.
 *
 * @component
 * @example
 * <FormField name="username" control={control} render={({ field }) => <input {...field} />} />
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

/**
 * Custom hook to access form field information, including validation state, error messages, and field state.
 * This hook provides the necessary field states like validity, touch state, and error messages.
 *
 * @hook
 * @throws {Error} Throws an error if used outside of the `FormField` context.
 * @property {boolean} invalid - Indicates whether the form field is invalid.
 * @property {boolean} isDirty - Indicates whether the form field value has been modified.
 * @property {boolean} isTouched - Indicates whether the form field has been interacted with.
 * @property {boolean} isValidating - Indicates whether the form field is currently being validated.
 * @property {FieldError | undefined} [error] - The error object for the form field, if any.
 * @property {string} id - The unique ID of the form item.
 * @property {string} name - The name of the form field.
 * @property {string} formItemId - The ID of the form item associated with this field.
 * @property {string} formDescriptionId - The ID of the description text for this form item.
 * @property {string} formMessageId - The ID of the message text for this form item, typically error messages.
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

/**
 * FormItem component to wrap individual form elements.
 * Provides context for each form item and renders the field.
 *
 * @component
 * @example
 * <FormItem className="space-y-2">
 *   <FormLabel>Username</FormLabel>
 *   <FormControl>
 *     <input />
 *   </FormControl>
 * </FormItem>
 */
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

/**
 * FormLabel component to render a label element for a form field.
 * It links the label with the associated form control using `htmlFor` attribute.
 * The label also reflects validation error states.
 *
 * @component
 * @example
 * <FormLabel>Username</FormLabel>
 */
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

/**
 * FormControl component to render a form control with proper aria attributes.
 * It associates the form control with description and error message IDs for accessibility.
 *
 * @component
 * @example
 * <FormControl>
 *   <input />
 * </FormControl>
 */
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

/**
 * FormDescription component to render description text below a form field.
 * This component provides additional information about the form field.
 *
 * @component
 * @example
 * <FormDescription>Enter your username</FormDescription>
 */
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

/**
 * FormMessage component to display error messages associated with form fields.
 * It renders an error message if the form field has an error.
 *
 * @component
 * @example
 * <FormMessage>Error message</FormMessage>
 */
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
