import type { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
}

export default function StoreListContainer({ children }: Props) {
  return (
    <aside
      id="store-selection"
      style={{
        boxShadow: "0px 8px 16px 0px #00000014, 0px 0px 4px 0px #0000000A",
      }}
      class="absolute right-0 lg:w-[359px] h-fit shadow-lg mx-2 lg:mx-0 top-full max-h-[78dvh] lg:max-h-[86dvh] flex gap-6 flex-col bg-white px-4 py-6 overflow-y-auto z-10 pointer-events-auto"
    >
      {children}
    </aside>
  );
}
