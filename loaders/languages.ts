import { ImageWidget } from "apps/admin/widgets.ts";
import { allowCorsFor } from "@deco/deco";
import { AppContext } from "../apps/site.ts";

/**
 * @title {{{label}}} - {{{alt}}}
 */
export interface Lang {
  /**
   * @title Language text
   */
  label: string;
  /**
   * @title Value
   * @description Value will be used for global language cookie on the site
   */
  value: string;
  salesChannel: string;
  /**
   * @title Flag
   */
  flag: ImageWidget;
  /**
   * @title Alternate text
   */
  alt: string;
}

export interface Props {
  /**
   * @title Language Options
   */
  langs?: Lang[];
}

export type Langs = Lang[];

/**
 * @title Language options
 */
export default function loader(
  { langs = [] }: Props,
  req: Request,
  ctx: AppContext,
): Lang[] {
  // Allow Cors
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });

  return langs;
}
