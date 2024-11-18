// https://demoaccount20.vtexcommercestable.com.br/api/checkout/pub/regions/
interface Props {
  regionId?: string;
  /**
   * @description Geocoordinates (first longitude, then latitude) around which to search for pickup points. If you use this type of search, do not pass postal and country codes.
   */
  geoCoordinates?: number[];
  /**
   * @description Postal code around which to search for pickup points. If you use this type of search, make sure to pass a countryCode and do not pass geoCoordinates.
   */
  postalCode?: string;
  /**
   * @description Three letter country code referring to the postalCode field. Pass the country code only if you are searching pickup points by postal code.
   */
  countryCode?: string;
}

export type SellersByLocation = {
  id?: string;
  sellers?: { id?: string; name?: string; logo?: string | null }[];
};

export default async function loader(
  props: Props,
  _req: Request,
): Promise<SellersByLocation[]> {
  const { geoCoordinates, postalCode, countryCode, regionId } = props;

  // Construir o caminho da URL com regionId se ele existir
  const path = regionId ? `regions/${regionId}` : "regions";

  const queryParams = new URLSearchParams({
    ...(geoCoordinates ? { geoCoordinates: geoCoordinates.join(",") } : {}),
    ...(postalCode ? { postalCode } : {}),
    ...(countryCode ? { country: countryCode } : {}),
  });

  const url =
    `https://demoaccount20.vtexcommercestable.com.br/api/checkout/pub/${path}/?${queryParams.toString()}`;

  const response = await fetch(url);
  const sellersByLocation = await response.json();

  return sellersByLocation ?? {};
}
