import { model, Schema, Document } from "mongoose";
import randomstring from "randomstring";

export interface UrlInterface extends Document {
    url: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}

const urlSchema = new Schema(
    {
        url: { type: String, required: true },
        code: {
            type: String,
            unique: true,
            default: randomstring.generate({
                length: 8,
                capitalization: "lowercase"
            })
        }
    },
    {
        collection: "URLs",
        timestamps: true
    }
);

export default model("URL", urlSchema);
