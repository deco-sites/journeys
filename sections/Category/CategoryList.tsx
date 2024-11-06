import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import type { Message } from "apps/website/flags/multivariate/message.ts";

interface CategoryItem {
  image: ImageWidget;
  label: Message;
  /** @title Link */
  href: string;
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
    {categories.map(({ image, href, label }) => (
      <a
        href={href}
        class="flex flex-col max-w-[50%] w-full px-2 md:max-w-none "
      >
        <div class="flex">
          <Image
            src={image}
            alt={label}
            width={400}
            height={400}
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
