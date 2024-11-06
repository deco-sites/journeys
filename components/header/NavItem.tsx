import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";

export interface MenuSubItemProps {
  name: string;
  subItemUrl: string;
  isBrand?: boolean;
}

export interface MenuItemProps {
  item: string;
  itemUrl?: string;
  subItems?: MenuSubItemProps[];
}

function NavItem({ item, subItems }: MenuItemProps) {
  return (
    <li
      class="group flex items-center pr-5 lg:pr-0 "
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <span
        class={clx(
          "font-primary text-sm font-medium",
          "relative lg:group-hover:after:content-[''] lg:group-hover:after:absolute",
          "lg:group-hover:after:top-9 lg:group-hover:after:left-0 lg:group-hover:after:w-full",
          "lg:group-hover:after:border-b-[3px] lg:group-hover:after:border-b-green-100",
          "lg:py-4 lg:capitalize lg:cursor-pointer",
        )}
      >
        {item}
      </span>
      <div
        class={clx(
          "fixed hidden hover:flex bg-base-100 z-40 items-start justify-center gap-6 border-t-2 border-b-2 border-base-200 w-full",
          (subItems && subItems?.length > 0) ? "group-hover:flex" : "",
        )}
        style={{
          top: "0px",
          left: "0px",
          marginTop: HEADER_HEIGHT_DESKTOP,
        }}
      >
        <ul class="flex items-start justify-start gap-6 container">
          {subItems?.map(({ name, subItemUrl }) => (
            <li class="p-6 pl-0">
              <a class="hover:border-b border-b-green-100" href={subItemUrl}>
                <span>{name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default NavItem;
