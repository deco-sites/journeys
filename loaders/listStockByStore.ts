import { ProductBalance } from "apps/vtex/utils/types.ts";
import { AppMiddlewareContext } from "../apps/deco/vtex.ts";

interface Props {
  /**
   * @description Product SKU
   */
  skuId: number;
}

export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppMiddlewareContext,
): Promise<ProductBalance[]> {
  const { skuId } = props;
  const { vcs } = await ctx.invoke.vtex.loaders.config({});

  try {
    const stockByStore = await vcs
      ["GET /api/logistics/pvt/inventory/skus/:skuId"]({ skuId })
      .then((r) => r.json()) as {
        skuId?: string;
        balance?: ProductBalance[];
      };

    return stockByStore.balance || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const cache = "no-cache";

export const cacheKey = ({ skuId }: Props) => `${skuId}`;
