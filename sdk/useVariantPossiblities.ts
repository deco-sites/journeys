import type { ProductLeaf, PropertyValue } from "apps/commerce/types.ts";

export type Possibilities = Record<
  string,
  Record<string, { url: string; image?: string; skuId: string } | undefined>
>;

const hash = ({ name, value }: PropertyValue) => `${name}::${value}`;

const omit = new Set(["category", "cluster", "RefId", "descriptionHtml"]);

export const useVariantPossibilities = (
  variants: ProductLeaf[],
  selected: ProductLeaf,
): Possibilities => {
  const possibilities: Possibilities = {};
  const selectedSpecs = new Set(selected.additionalProperty?.map(hash));

  for (const variant of variants) {
    const { url, additionalProperty = [], productID, image } = variant;
    const isSelected = productID === selected.productID;
    const specs = additionalProperty.filter(({ name }) => !omit.has(name!));
    const firstImageUrl = image?.[0]?.url;

    for (let it = 0; it < specs.length; it++) {
      const name = specs[it].name!;
      const value = specs[it].value!;

      if (omit.has(name)) continue;

      if (!possibilities[name]) {
        possibilities[name] = {};
      }

      // First row is always selectable
      const isSelectable = it === 0 ||
        specs.every((s) => s.name === name || selectedSpecs.has(hash(s)));

      const validUrl = url || "";
      possibilities[name][value] = isSelected
        ? { url: validUrl, image: firstImageUrl, skuId: productID }
        : isSelectable
        ? possibilities[name][value] ||
          { url: validUrl, image: firstImageUrl, skuId: productID }
        : possibilities[name][value];
    }
  }

  return possibilities;
};
