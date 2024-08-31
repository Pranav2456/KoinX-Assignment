import { Router } from "express";
import * as transactionController from "../controllers/transaction.controllers";
import { errorHandler, healthCheck, notFound } from "../utils/errorHandler";

const router = Router();

router.get("/", healthCheck);
router.get("/transactions/:address", transactionController.getTransactions);
router.get("/expenses/:address", transactionController.getUserExpenses);

router.all("*", notFound);
router.use(errorHandler);

export default router;
