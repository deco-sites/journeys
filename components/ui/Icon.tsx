import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "search"
  | "heart"
  | "shopping-bag"
  | "menu"
  | "account_circle"
  | "close"
  | "star"
  | "chevron-right"
  | "afterpay"
  | "favorite"
  | "plus"
  | "minus"
  | "home_pin"
  | "call"
  | "local_shipping"
  | "pan_zoom"
  | "share"
  | "sell"
  | "check-circle"
  | "error"
  | "trash"
  | "Location"
  | "user"
  | "Info";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="search" />
   */
  id: AvailableIcons;
  size?: number;
}

function Icon({ id, size = 24, width, height, ...otherProps }: Props) {
  return (
    <svg {...otherProps} width={width ?? size} height={height ?? size}>
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
