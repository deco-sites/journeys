import { Place } from "apps/commerce/types.ts";
import { StoreItem } from "./List.tsx";

export interface Props {
  selectedStore?: Place;
}

export function SelectedContainer({ selectedStore }: Props) {
  if (!selectedStore) {
    return <div id="store-selected-container" />;
  }

  return (
    <div id="store-selected-container">
      <StoreItem store={selectedStore} />
    </div>
  );
}
