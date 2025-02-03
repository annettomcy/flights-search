import axios from "axios";

const BASE_URL = "https://sky-scrapper.p.rapidapi.com/api/v1/flights";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
    "X-RapidAPI-Host": import.meta.env.VITE_RAPID_API_HOST,
  },
});

export const searchAirports = async (query) => {
  try {
    const response = await apiClient.get("/searchAirport", {
      params: { query },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching airports:", error);
    throw error;
  }
};

export const searchFlights = async (params) => {
  try {
    const response = await apiClient.get("/searchFlights", {
      params: {
        originSkyId: params.originSkyId,
        destinationSkyId: params.destinationSkyId,
        originEntityId: params.originEntityId,
        destinationEntityId: params.destinationEntityId,
        date: params.startDate?.toISOString().split("T")[0],
        returnDate: params.endDate?.toISOString().split("T")[0],
        cabinClass: params.cabinClass,
        adults: params.adults,
        childrens: params.childrens,
        infants: params.infants,
        sortBy: params.sortBy,
        currency: params.currency,
        market: params.market,
        countryCode: params.countryCode,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
};
