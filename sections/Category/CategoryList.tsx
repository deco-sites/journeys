import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

interface CategoryItem {
  image: ImageWidget;
  href: string;
  label: string;
  width: number;
  height: number;
}

export interface Props {
  /**
   * @minItems 4
   * @maxItems 4
   */
  categories: CategoryItem[];
}

const CategoryList = ({ categories }: Props) => (
  <div class="flex flex-wrap gap-y-9 mt-12 max-w-[1560px] mx-auto md:mt-20 md:flex-nowrap">
    {categories.map(({ image, href, label, width, height }) => (
      <a
        href={href}
        class="flex flex-col max-w-[50%] w-full px-2 md:max-w-none "
      >
        <div class="flex">
          <Image
            src={image}
            alt={label}
            width={width}
            height={height}
            loading="lazy"
            class="w-full"
          />
        </div>
        <span class="font-bold font-primary text-black text-sm/tight uppercase">
          {label} {">"}
        </span>
      </a>
    ))}
  </div>
);

export default CategoryList;
