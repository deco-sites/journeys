import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../../sections/Component.tsx";
import { AppContext } from "apps/vtex/mod.ts";
import type { SimulationOrderForm, SKU, Sla } from "apps/vtex/utils/types.ts";

export interface Props {
  items: SKU[];
  /**
   * @ignore
   */
  variant?: "results";
  /**
   * @ignore
   */
  result?: SimulationOrderForm | null;
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} business days`;
  if (type === "d") return `${time} days`;
  if (type === "h") return `${time} hours`;
};
// const Results = import.meta.resolve("../Results.tsx");

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  try {
    const result = (await ctx.invoke("vtex/actions/cart/simulation.ts", {
      items: props.items,
      postalCode: `${form.get("postalCode") ?? ""}`,
      country: "USA",
    })) as SimulationOrderForm | null;

    return { result, ...props };
  } catch {
    return { result: null };
  }
}

export function Results({ result }: { result?: SimulationOrderForm | null }) {
  const methodsBySeller = result?.logisticsInfo?.reduce((acc, { slas, itemIndex }) => {
    // @ts-ignore
    const seller = result.items[itemIndex]?.seller ?? "Journeys";
    console.log({seller})
    if (!acc[seller]) {
      acc[seller] = [];
    }
    acc[seller].push(...slas);
    return acc;
  }, {} as Record<string, Sla[]>) ?? {};

  if (!Object.keys(methodsBySeller).length) {
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
      {Object.entries(methodsBySeller).map(([seller, methods]) => (
        <li key={seller} class="flex flex-col gap-2">
          {
            Object.entries(methodsBySeller).length > 1 && (
              <span class="font-bold">Seller: {seller}</span>
            )
          }
          {methods.map((method) => (
            <div class="flex justify-between items-center border-base-200 not-first-child:border-t">
              <span class="text-button text-center">{method.name}</span>
              <span class="text-button">
                {formatShippingEstimate(method.shippingEstimate)}
              </span>
              <span class="text-base font-semibold text-right">
                {method.price === 0
                  ? "Free"
                  : formatPrice(method.price / 100, "USD", "en-US")}
              </span>
            </div>
          ))}
        </li>
      ))}
      <span class="text-xs font-thin">
        Delivery times start counting from confirmation of the order payment and
        may vary according to the quantity of products in the bag.
      </span>
    </ul>
  );
}

export default function Form({ items, ...props }: Props) {
  const slot = useId();

  if (props?.variant === "results") {
    return <Results result={props?.result} />;
  }

  return (
    <div class="flex flex-col gap-2">
      <div class="hidden">{Results}</div>
      <div class="flex flex-col">
        <span class="text-[#616B6B] text-sm pt-5 border-t-[1px] border-gray-300 font-primary">
          Please provide your ZIP code to check the delivery times.
        </span>
      </div>

      <form
        class="relative join"
        hx-target={`#${slot}`}
        hx-swap="innerHTML"
        hx-sync="this:replace"
        hx-post={useComponent(import.meta.url, {
          items,
          variant: "results",
        })}
      >
        <input
          as="input"
          type="text"
          class="input input-bordered join-item w-48 rounded-none"
          placeholder="00000"
          name="postalCode"
          maxLength={8}
          size={8}
        />
        <button
          type="submit"
          class="btn join-item no-animation rounded-none  bg-black text-white hover:bg-black"
        >
          <span class="[.htmx-request_&]:hidden inline">Calculate</span>
          <span class="[.htmx-request_&]:inline hidden ">Calculating...</span>
          <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
        </button>
      </form>

      {/* Results Slot */}
      <div id={slot} />
    </div>
  );
}
