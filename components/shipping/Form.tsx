import type { SKU } from "apps/vtex/utils/types.ts";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../../sections/Component.tsx";

export interface Props {
  items: SKU[];
}

const Results = import.meta.resolve("./TestResults.tsx");

export default function Form({ items }: Props) {
  const slot = useId();

  return (
    <div class="flex flex-col gap-2">
      <div class="hidden">
        {Results}
      </div>
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
        hx-post={useComponent(Results, {
          items,
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
