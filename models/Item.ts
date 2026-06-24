// // models/Item.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface IItem extends Document {
//   name: string;
//   slug: string;
//   description: string;
//   price: number;            // store as cents or decimal – decide one (I’ll use number for simplicity)
//   images: string[];         // URLs
//   category: mongoose.Types.ObjectId;  // ref to Category
//   sizes?: string[];         // e.g. ['S','M','L']
//   stock?: number;           // total available quantity
//   // you can later add color, brand, etc.
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ItemSchema = new Schema<IItem>(
//   {
//     name: { type: String, required: true, trim: true },
//     slug: { type: String, required: true, unique: true, lowercase: true },
//     description: { type: String, default: '' },
//     price: { type: Number, required: true, min: 0 },
//     images: [{ type: String }],
//     category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
//     sizes: [{ type: String }],
//     stock: { type: Number, default: 0, min: 0 },
//   },
//   { timestamps: true }
// );

// // Auto‑generate slug
// ItemSchema.pre('save', function (next) {
//   if (this.isModified('name') && !this.slug) {
//     this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
//   }
//   next();
// });

// export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);