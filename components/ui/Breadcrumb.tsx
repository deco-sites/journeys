import type { BreadcrumbList } from "apps/commerce/types.ts";
import { relative } from "../../sdk/url.ts";
import Icon from "./Icon.tsx";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement];

  return (
    <ul class="flex items-center gap-1 py-2 overflow-x-auto">
      {items
        .filter(({ name, item }) => name && item)
        .map(({ name, item }, index) => (
          <li class="text-[#666] last:text-[#202020] text-sm flex items-center gap-1 whitespace-nowrap">
            <a href={relative(item)}>{name}</a>
            {index < items.length - 1 && <Icon id="chevron-right" size={14} />}
          </li>
        ))}
    </ul>
  );
}

export default Breadcrumb;
