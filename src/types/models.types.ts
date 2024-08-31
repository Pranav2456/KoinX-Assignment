import mongoose, { Document, SchemaTimestampsConfig } from "mongoose";

export interface ITransaction extends Document {
  address: string;
  hash: string;
  blockNumber: number;
  timeStamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: string;
}

export interface IEthPrice extends Document {
  price: number;
  timestamp: Date;
}
