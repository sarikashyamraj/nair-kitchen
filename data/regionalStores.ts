export type SupportedCountry =
  | "United Arab Emirates"
  | "India"
  | "United States"
  | "United Kingdom"
  | "Canada"
  | "Australia"
  | "Singapore"
  | "Saudi Arabia"
  | "Qatar"
  | "Oman"
  | "Kuwait"
  | "Japan";

export const regionalStores: Record<
  SupportedCountry,
  string[]
> = {
  "United Arab Emirates": [
    "Lulu Hypermarket",
    "Carrefour",
    "Union Coop",
    "Spinneys",
    "Waitrose",
    "Choithrams",
    "Nesto",
    "VIVA",
  ],

  India: [
    "Reliance Smart",
    "DMart",
    "More Supermarket",
    "Spencer’s",
    "BigBasket",
    "Nature’s Basket",
    "Star Bazaar",
    "Vishal Mega Mart",
  ],

  "United States": [
    "Walmart",
    "Target",
    "Costco",
    "Kroger",
    "Whole Foods Market",
    "Trader Joe’s",
    "Safeway",
    "Publix",
  ],

  "United Kingdom": [
    "Tesco",
    "Sainsbury’s",
    "ASDA",
    "Morrisons",
    "Waitrose",
    "Aldi",
    "Lidl",
    "Marks & Spencer Food",
  ],

  Canada: [
    "Walmart",
    "Costco",
    "Loblaws",
    "Sobeys",
    "Metro",
    "No Frills",
    "Real Canadian Superstore",
    "FreshCo",
  ],

  Australia: [
    "Woolworths",
    "Coles",
    "Aldi",
    "IGA",
    "Costco",
    "Foodworks",
    "Harris Farm Markets",
  ],

  Singapore: [
    "NTUC FairPrice",
    "Cold Storage",
    "Giant",
    "Sheng Siong",
    "Mustafa Centre",
    "Prime Supermarket",
    "Don Don Donki",
  ],

  "Saudi Arabia": [
    "Panda",
    "Danube",
    "Carrefour",
    "Lulu Hypermarket",
    "Tamimi Markets",
    "Othaim Markets",
    "Farm Superstores",
  ],

  Qatar: [
    "Lulu Hypermarket",
    "Carrefour",
    "Al Meera",
    "Monoprix",
    "Safari Hypermarket",
    "Family Food Centre",
    "Grand Hypermarket",
  ],

  Oman: [
    "Lulu Hypermarket",
    "Carrefour",
    "Nesto",
    "Sultan Center",
    "Al Fair",
    "KM Trading",
    "Mars Hypermarket",
  ],

  Kuwait: [
    "The Sultan Center",
    "Carrefour",
    "Lulu Hypermarket",
    "Saveco",
    "City Centre",
    "Oncost",
    "Grand Hyper",
  ],

  Japan: [
    "AEON",
    "Ito-Yokado",
    "Seiyu",
    "Life",
    "Maruetsu",
    "OK Store",
    "Gyomu Super",
    "Don Quijote",
  ],
};

export const fallbackStores = [
  "Local Supermarket",
  "Local Grocery Store",
  "Online Grocery",
];

export function getRegionalStores(
  country: string
): string[] {
  const supportedCountry = country as SupportedCountry;

  return regionalStores[supportedCountry]
    ? [...regionalStores[supportedCountry]]
    : [...fallbackStores];
}