import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

interface CollectionItem {
  image: ImageWidget;
  /**  @title Link */
  href: string;
  title: string;
  label: string;
}

export interface Props {
  /**
   * @minItems 3
   * @maxItems 3
   */
  collections: CollectionItem[];
}

const CollectionList = ({ collections }: Props) => (
  <div class="flex flex-wrap gap-y-9 mt-12 max-w-[1560px] mx-auto md:mt-20 md:flex-nowrap">
    {collections.map(({ image, href, title, label }) => (
      <a href={href} class="flex flex-col w-full px-2 md:max-w-none ">
        <div class="flex">
          <Image
            src={image}
            alt={label}
            width={700}
            height={700}
            loading="lazy"
            class="w-full"
          />
        </div>
        <span class="font-primary text-gray-100 text-xl/tight py-2.5 uppercase">
          {title}
        </span>
        <span class="font-bold font-primary text-black text-sm/tight uppercase">
          {label} {">"}
        </span>
      </a>
    ))}
  </div>
);

export default CollectionList;
