import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    news_title: {
      type: String,
      required: [true, "Nyheten må ha en tittel"],
      maxlength: [100, "Tittelen kan ikke være mer enn 100 tegn"],
    },
    news_content: {
      type: String,
      required: [true, "Nyheten må ha innhold"],
      maxlength: [5000, "Innholdet kan ikke være mer enn 5000 tegn"],
    },
    news_image: {
      type: String,
      required: false, // Kan gjøres obligatorisk hvis ønskelig
      default: "https://via.placeholder.com/300https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507024/IMG_8533-1_cuqh4v.jpg", // Standardbilde hvis ingen er oppgitt
    },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model("News", NewsSchema);