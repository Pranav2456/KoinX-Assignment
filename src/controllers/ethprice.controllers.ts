import EthPrice from "../models/ethprice.models";
import * as coingeckoService from "../services/coingecko.services";

export const fetchAndStoreEthPrice = async (): Promise<void> => {
  try {
    const price = await coingeckoService.fetchEthPrice();
    await EthPrice.create({ price });
    console.log("Ethereum price stored:", price);
  } catch (error) {
    console.error("Error fetching and storing Ethereum price:", error);
  }
};
