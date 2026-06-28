// models/Item.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;            // store as cents or decimal – decide one (I’ll use number for simplicity)
  discount?: number;        // percentage discount, optional
  images: string[];         // URLs
  category: string;  
  sizes?: string[];         // e.g. ['S','M','L']
  colors?: string[];        // e.g. ['red','blue']
  stock?: number;           // total available quantity
  inStock?: boolean;        // whether the item is in stock
  // you can later add color, brand, etc.
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    images: [{ type: String }],
    category: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [{type:String}],
    stock: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);