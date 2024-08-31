import mongoose, { Document, Schema } from "mongoose";
import { ITransaction } from "../types/models.types";

const TransactionSchema: Schema = new Schema({
  address: {
    type: String,
    required: true,
    index: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  timeStamp: {
    type: Number,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  gasUsed: {
    type: Number,
    required: true,
  },
  gasPrice: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
