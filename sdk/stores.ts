import { Place } from "apps/commerce/types.ts";

export interface StoresByState {
  [state: string]: Place[];
}

interface GroupStoresByStateParams {
  places: Place[];
  storesPerState?: number; // default = 1
  language?: string; // default = "en"
}

const stateNameMapping = {
  USA: {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
    DC: "District of Columbia",
  },
  CAN: {
    AB: "Alberta",
    BC: "British Columbia",
    MB: "Manitoba",
    NB: "New Brunswick",
    NL: "Newfoundland and Labrador",
    NS: "Nova Scotia",
    NT: "Northwest Territories",
    NU: "Nunavut",
    ON: "Ontario",
    PE: "Prince Edward Island",
    QC: "Quebec",
    SK: "Saskatchewan",
    YT: "Yukon",
  },
} as const;

const getFullStateName = (stateCode: string, countryCode?: string): string => {
  if (!countryCode) return stateCode;
  const countryMapping =
    stateNameMapping[countryCode as keyof typeof stateNameMapping];
  return (
    countryMapping?.[stateCode as keyof typeof countryMapping] || stateCode
  );
};

const languageToCountry = {
  en: "USA",
  "en-ca": "CAN",
  "fr-ca": "CAN",
} as const;

export const groupStoresByState = ({
  places,
  storesPerState = 1,
  language = "en",
}: GroupStoresByStateParams): StoresByState => {
  const stateMap: StoresByState = {};
  const countryFilter =
    languageToCountry[language as keyof typeof languageToCountry] || "USA";

  places.forEach((place) => {
    const stateCode = place?.address?.addressRegion;
    const countryCode = place?.address?.addressCountry;
    if (!stateCode || countryCode !== countryFilter) return;

    const fullStateName = getFullStateName(stateCode, countryCode);

    if (!stateMap[fullStateName]) {
      stateMap[fullStateName] = [];
    }
    stateMap[fullStateName].push(place);
  });

  const orderedStateMap: StoresByState = {};
  Object.keys(stateMap)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .forEach((state) => {
      orderedStateMap[state] = stateMap[state].slice(0, storesPerState);
    });

  return orderedStateMap;
};
