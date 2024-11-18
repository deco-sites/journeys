/**
 * TODO: support other platforms. Currently only for VTEX
 */
import { AppContext } from "apps/vtex/mod.ts";
import type { SimulationOrderForm, SKU, Sla } from "apps/vtex/utils/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import { ComponentProps } from "../../sections/Component.tsx";

export interface Props {
  items: SKU[];
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} business days`;
  if (type === "d") return `${time} days`;
  if (type === "h") return `${time} hours`;
};

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  try {
    const result = await ctx.invoke("vtex/actions/cart/simulation.ts", {
      items: props.items,
      postalCode: `${form.get("postalCode") ?? ""}`,
      country: "USA",
    }) as SimulationOrderForm | null;

    return { result };
  } catch {
    return { result: null };
  }
}

export default function Results({ result }: ComponentProps<typeof action>) {
  const methods = result?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  if (!methods.length) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <ul class="flex flex-col gap-4 p-4 border border-base-400 rounded">
      <div class="hidden" id="shipping-result">
        {JSON.stringify(result)}
      </div>
      {methods.map((method) => (
        <li class="flex justify-between items-center border-base-200 not-first-child:border-t">
          <span class="text-button text-center">
            {method.name}
          </span>
          <span class="text-button">
            {formatShippingEstimate(method.shippingEstimate)}
          </span>
          <span class="text-base font-semibold text-right">
            {method.price === 0 ? "Free" : (
              formatPrice(method.price / 100, "USD", "en-US")
            )}
          </span>
        </li>
      ))}
      <span class="text-xs font-thin">
        Delivery times start counting from confirmation of the order payment and
        may vary according to the quantity of products in the bag.
      </span>
    </ul>
  );
}
