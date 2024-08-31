import mongoose, { Document, Schema } from "mongoose";
import { IEthPrice } from "../types/models.types";

const EthPriceSchema: Schema = new Schema({
  price: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IEthPrice>("EthPrice", EthPriceSchema);
