import { MINICART_DRAWER_ID } from "../../constants.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
const onLoad = (id: string) =>
  window.STOREFRONT.CART.subscribe((sdk) => {
    const counter = document.getElementById(id);
    const count = sdk.getCart()?.items.length ?? 0;
    if (!counter) {
      return;
    }
    // Set minicart items count on header
    if (count === 0) {
      counter.classList.add("hidden");
    } else {
      counter.classList.remove("hidden");
    }
    counter.innerText = count > 99 ? "99+" : count.toString();
  });
function Bag() {
  const id = useId();
  return (
    <>
      <label
        class="indicator items-baseline"
        for={MINICART_DRAWER_ID}
        aria-label="open cart"
      >
        <span class="flex items-center justify-center size-6">
          <Icon id="shopping-bag" size={17} />
        </span>

        <span
          id={id}
          class="hidden text-base/none ml-0.5 text-gray-100"
        />
      </label>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </>
  );
}
export default Bag;
