import axios from "axios";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";

export const fetchEthPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: "ethereum",
        vs_currencies: "inr",
      },
    });

    return response.data.ethereum.inr;
  } catch (error) {
    console.error("Error fetching Ethereum price from CoinGecko:", error);
    throw error;
  }
};
