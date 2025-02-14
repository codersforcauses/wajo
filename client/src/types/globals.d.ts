import "react";

import { JwtPayload as OriginalJwtPayload } from "jwt-decode";

declare module "react" {
  /**
   * Extends the standard HTML attributes for styling elements to include custom attributes.
   *
   * @interface StyleHTMLAttributes
   * @extends React.HTMLAttributes
   *
   * @property {boolean} jsx - Indicates JSX styling.
   * @property {boolean} global - Indicates global styling.
   */
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

declare module "jwt-decode" {
  /**
   * Note: Extended the JwtPayload interface to include the user_id property.
   *
   * @interface JwtPayload
   * @extends OriginalJwtPayload
   *
   * @property {string} user_id - The unique identifier for the user.
   */
  export interface JwtPayload extends OriginalJwtPayload {
    user_id: string;
    primary_id: string;
    role: string | undefined;
  }
}
