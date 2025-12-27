import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    answer: {
      type: String,
      required: true,
    },

    isBestAnswer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const QuestionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "answered"],
      default: "pending",
    },

    answers: [AnswerSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);