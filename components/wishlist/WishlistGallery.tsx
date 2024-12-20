import type { SectionProps } from "@deco/deco";
import type { AppContext } from "../../apps/site.ts";
import SearchResult, {
  type Props as SearchResultProps,
} from "../search/SearchResult.tsx";
export type Props = SearchResultProps;

function WishlistGallery(props: SectionProps<typeof loader>) {
  const isEmpty = !props.page || props.page.products.length === 0;
  if (isEmpty) {
    return (
      <div class="container mx-4 sm:mx-auto">
        <div class="mx-10 my-20 flex flex-col gap-4 justify-center items-center">
          <span class="font-medium text-2xl">Your wishlist is empty</span>
          <span>
            Log in and add items to your wishlist for later. They will show up
            here
          </span>
        </div>
      </div>
    );
  }
  return (
    <SearchResult
      {...props}
      currencyCode={props.currencyCode}
      locale={props.locale}
    />
  );
}
export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  return {
    ...props,
    currencyCode: await ctx.invoke.site.loaders.getCurrency(),
    locale: await ctx.invoke.site.loaders.getLocale(),
    url: req.url,
  };
};
export default WishlistGallery;
