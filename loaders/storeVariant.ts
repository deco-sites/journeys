/**
 * @title {{{title}}}
 */
export interface StoreVariant {
  /**
   * @ignore
   */
  active?: boolean;
  /**
   * @title Default
   * @description If true, the variant will be the default one
   */
  default?: boolean;
  /**
   * @title Title
   */
  title?: string;
  /**
   * @description The value creates a cookie store_variant with the value, which can be used to segment the user
   */
  value?: string;
  link?: string;
  /**
   * @description Sales channel for the variant (not used for now), but present to show it as a possible segmentation option
   */
  salesChannel?: string;
}

export interface Props {
  variants?: StoreVariant[];
}

export type StoreVariants = StoreVariant[];

export default function loader({ variants = [] }: Props): StoreVariants {
  return variants;
}
