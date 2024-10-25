
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";

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


function NavItem({ item, itemUrl, subItems }: MenuItemProps) {

  return (
    <li
      class="group flex items-center pr-5"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <span
        class="group-hover:underline text-sm font-medium"
      >
        {item}
      </span>
        <div
          class="fixed hidden hover:flex group-hover:flex bg-base-100 z-40 items-start justify-center gap-6 border-t-2 border-b-2 border-base-200 w-screen"
          style={{
            top: "0px",
            left: "0px",
            marginTop: HEADER_HEIGHT_DESKTOP,
          }}
        >
          <ul class="flex items-start justify-start gap-6 container">
            {subItems?.map(({ name, subItemUrl }) => (
              <li class="p-6 pl-0">
                <a class="hover:underline" href={subItemUrl}>
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
