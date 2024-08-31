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
    const { page = 1, limit = 100 } = req.query;

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      res.status(400).json({ error: "Invalid Ethereum address" });
      return;
    }

    const skip = (Number(page) - 1) * Number(limit);

    let transactions = await Transaction.find({ address })
      .skip(skip)
      .limit(Number(limit))
      .sort({ blockNumber: -1 });

    if (transactions.length === 0) {
      const newTransactions = await etherscanService.fetchTransactions(address);
      await Transaction.insertMany(newTransactions, { ordered: false });
      transactions = newTransactions.slice(skip, skip + Number(limit));
    }

    const total = await Transaction.countDocuments({ address });

    res.json({
      transactions,
      page: Number(page),
      limit: Number(limit),
      total,
    });
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

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      res.status(400).json({ error: "Invalid Ethereum address" });
      return;
    }

    const [expenseResult] = await Transaction.aggregate([
      { $match: { address } },
      {
        $group: {
          _id: null,
          totalExpenses: {
            $sum: { $divide: [{ $multiply: ["$gasUsed", { $toDouble: "$gasPrice" }] }, 1e18] }
          }
        }
      }
    ]);

    const latestEthPrice = await EthPrice.findOne().sort({ timestamp: -1 });

    res.json({
      address,
      totalExpenses: expenseResult ? expenseResult.totalExpenses : 0,
      currentEthPrice: latestEthPrice ? latestEthPrice.price : null,
    });
  } catch (error) {
    console.error("Error calculating user expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};