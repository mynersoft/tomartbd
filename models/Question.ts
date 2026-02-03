import mongoose, { Schema, Document, Model } from "mongoose";
import { IQuestion, IAnswer } from "@/types/question";

/* -------- Answer Document -------- */
interface AnswerDocument extends Omit<IAnswer, "_id">, Document {}

/* -------- Question Document -------- */
interface QuestionDocument extends Omit<IQuestion, "_id">, Document {}

const AnswerSchema = new Schema<AnswerDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const QuestionSchema = new Schema<QuestionDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answers: {
      type: [AnswerSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/* -------- Prevent overwrite in Next.js -------- */
const Question: Model<QuestionDocument> =
  mongoose.models.Question ||
  mongoose.model<QuestionDocument>("Question", QuestionSchema);

export default Question;