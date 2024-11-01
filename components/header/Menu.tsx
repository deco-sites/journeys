import { clx } from "../../sdk/clx.ts";

/** @title {{ name }} */
export interface MenuSubItemProps {
  name: string;
  subItemUrl: string;
  isBrand?: boolean;
}

/** @title {{ item }} */
export interface MenuItemProps {
  item: string;
  itemUrl?: string;
  subItems?: MenuSubItemProps[];
}

export interface Props {
  navItems?: MenuItemProps[];
}

function MenuItem({ item, subItems, itemUrl }: MenuItemProps) {
  console.log(itemUrl, subItems);

  return (itemUrl && (subItems?.length === 0)) ? (
    <a
      class={clx(
        "block border-b border-b-/.1 p-2.5 pl-8 bg-white w-full",
        "font-primary font-bold text-gray-100 text-base/4 uppercase"
      )}
      href={itemUrl}
    >
      {item}
    </a>
  ) : (
    <div class="collapse collapse-plus rounded-none">
      <input class="peer h-auto min-h-fit" type="checkbox" />
      <div class={clx(
        "collapse-title",
        "p-2.5 pl-8 font-primary font-bold text-gray-100 text-base/4 uppercase min-h-fit h-fit",
        "after:font-bold after:text-xl/none after:text-orange-100 after:!top-2",
        "peer-checked:after:text-gray-100 peer-checked:bg-gray-200"
      )}>
        {item}
      </div>
      <div class="collapse-content !p-0 border-t border-black border-opacity-10">
        <ul>
          {subItems?.map(({ name, subItemUrl, isBrand }) => (
            <li>
              {isBrand ? (
                <a
                  class={clx(
                    "block border-b border-black border-opacity-10 p-2.5 pl-20 bg-white w-full",
                    "font-primary font-medium text-gray-100 text-base/4 uppercase"
                  )}
                  href={subItemUrl}
                >
                  {name}
                </a>
              ) : (
                <a
                  class={clx(
                    "block border-b border-black border-opacity-10 p-2.5 pl-20 bg-gray-200 w-full",
                    "font-primary font-bold text-gray-100 text-base/4 uppercase"
                  )}
                  href={subItemUrl}
                >
                  {name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div
      class="flex flex-col h-full overflow-y-auto"
      style={{ minWidth: "100vw" }}
    >
      <ul class="flex-grow flex flex-col overflow-y-auto">
        {navItems?.map(({ item, subItems, itemUrl }) => (
          <li class="border-b border-black border-opacity-10">
            <MenuItem item={item} subItems={subItems} itemUrl={itemUrl} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
