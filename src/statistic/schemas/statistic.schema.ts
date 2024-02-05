import { Document, Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type StatisticDocument = Statistic & Document;

@Schema()
export class Statistic {
  @Prop({ type: String })
  brand: string;

  @Prop({ type: String })
  platformId: string;

  @Prop({ type: String })
  article: string;

  @Prop({ type: String })
  productsOrdered: string;

  @Prop({ type: String })
  priceOrdered: string;

  @Prop({ type: String })
  day: string;

  @Prop({ type: String })
  week: string;

  @Prop({ type: String })
  month: string;

  @Prop({ type: String })
  turnover: string;

  @Prop({ type: MongooseSchema.Types.Number })
  shopId: number;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
