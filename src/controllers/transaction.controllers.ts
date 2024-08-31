import { Request, Response } from "express";
import Transaction from "../models/transaction.models";
import { ITransaction } from "../types/models.types";
import EthPrice from "../models/ethprice.models";
import * as etherscanService from "../services/etherscan.services";

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { address } = req.params;

    const transactions = await etherscanService.fetchTransactions(address);

    await Transaction.insertMany(transactions, { ordered: false });

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { address } = req.params;

    const transactions = await Transaction.find({ address });

    const totalExpenses = transactions.reduce(
      (total: number, tx: ITransaction) => {
        return total + (tx.gasUsed * parseInt(tx.gasPrice)) / 1e18;
      },
      0
    );

    const latestEthPrice = await EthPrice.findOne().sort({ timestamp: -1 });

    res.json({
      address,
      totalExpenses,
      currentEthPrice: latestEthPrice ? latestEthPrice.price : null,
    });
  } catch (error) {
    console.error("Error calculating user expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
