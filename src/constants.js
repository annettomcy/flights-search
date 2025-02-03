import { ArrowForward, MultipleStop, SyncAlt } from "@mui/icons-material";

export const CABIN_CLASS = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

export const TRIP_TYPES = [
  {
    value: "one_way",
    label: "One way",
    icon: ArrowForward,
  },
  {
    value: "round_trip",
    label: "Round trip",
    icon: SyncAlt,
  },
  {
    value: "multi_city",
    label: "Multi-city",
    icon: MultipleStop,
    disabled: true,
  },
];

export const DEFAULT_FLIGHT_SEARCH_PARAMS = {
  originSkyId: "",
  destinationSkyId: "",
  originEntityId: "",
  destinationEntityId: "",
  cabinClass: CABIN_CLASS[0].value,
  adults: 1,
  childrens: 0,
  infants: 0,
  sortBy: "best",
  currency: "USD",
  market: "en-US",
  countryCode: "US",
};
