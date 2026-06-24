// // models/Category.ts
// import mongoose, { Schema, Document } from 'mongoose';

// export interface ICategory extends Document {
//   name: string;
//   slug: string;
//   description?: string;
//   image?: string;   // URL
//   createdAt: Date;
//   updatedAt: Date;
// }

// const CategorySchema = new Schema<ICategory>(
//   {
//     name: { type: String, required: true, unique: true, trim: true },
//     slug: { type: String, required: true, unique: true, lowercase: true },
//     description: { type: String, default: '' },
//     image: { type: String, default: '' },
//   },
//   { timestamps: true }
// );

// // Pre‑save hook to generate slug from name if not provided
// CategorySchema.pre('save', function (next) {
//   if (this.isModified('name') && !this.slug) {
//     this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
//   }
//   next();
// });

// export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);