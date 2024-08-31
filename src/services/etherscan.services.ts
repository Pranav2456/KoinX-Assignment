import axios from "axios";
import { ITransaction } from "../types/models.types";

const ETHERSCAN_API_URL = "https://api.etherscan.io/api";

export const fetchTransactions = async (
  address: string
): Promise<ITransaction[]> => {
  try {
    const response = await axios.get(ETHERSCAN_API_URL, {
      params: {
        module: "account",
        action: "txlist",
        address,
        startblock: 0,
        endblock: 99999999,
        sort: "asc",
        apikey: process.env.ETHERSCAN_API_KEY,
      },
    });

    if (response.data.status === "1") {
      return response.data.result.map((tx: any) => ({
        address,
        hash: tx.hash,
        blockNumber: parseInt(tx.blockNumber),
        timeStamp: parseInt(tx.timeStamp),
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasUsed: parseInt(tx.gasUsed),
        gasPrice: tx.gasPrice,
      }));
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching transactions from Etherscan:", error);
    throw error;
  }
};
