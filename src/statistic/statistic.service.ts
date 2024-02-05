import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from "fs";
import { Statistic, StatisticDocument } from "./schemas/statistic.schema";
import { Model } from "mongoose";

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Statistic.name)
    private statisticsModel: Model<StatisticDocument>,
  ) {}
  async getFile(filePath: string) {
    const fileData = fs.readFileSync(filePath);
    return JSON.parse(fileData.toString());
  }

  async getStatisticsInfo() {
    const shop1 = await this.getShopInfo(1);
    const shop2 = await this.getShopInfo(2);

    const filteredMaxPrice = this.preparePeriods(
      shop1.maxPricePeriods,
      shop2.maxPricePeriods,
    );
    const filteredMaxOrdered = this.preparePeriods(
      shop1.maxOrderedPeriods,
      shop2.maxOrderedPeriods,
    );

    shop1.maxPricePeriods = filteredMaxPrice[0];
    shop1.maxOrderedPeriods = filteredMaxOrdered[0];
    shop2.maxPricePeriods = filteredMaxPrice[1];
    shop2.maxOrderedPeriods = filteredMaxOrdered[1];

    const statistics = {
      name: "Статистика",
      shops: [shop1, shop2],
    };
    return statistics;
  }

  preparePeriods(shop1Collection: any[], shop2Collection: any[]) {
    const filteredForShop1 = shop1Collection.filter((item) => {
      return item._id.includes("2023") === true;
    });

    let filteredForShop2 = [];
    filteredForShop1.forEach((item) => {
      const product = shop2Collection.find(
        (secondItem) => secondItem._id === item._id,
      );
      if (product) filteredForShop2.push(product);
    });

    return [filteredForShop1, filteredForShop2];
  }

  async getShopInfo(shopId: number) {
    const products = await this.statisticsModel.aggregate([
      {
        $match: {
          shopId: shopId,
        },
      },
      {
        $group: {
          _id: "$platformId",
          firstDocument: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$firstDocument" },
      },
    ]);

    const priceOrdered = await this.statisticsModel.aggregate([
      ...this.buildAggregateSumParams(shopId, "priceOrdered"),
    ]);

    const productsOrdered = await this.statisticsModel.aggregate([
      ...this.buildAggregateSumParams(shopId, "productsOrdered"),
    ]);

    const maxPricesByPeriod = await this.statisticsModel.aggregate([
      ...this.buildAggregatePeriodParams(shopId, "priceOrdered"),
    ]);

    const maxOrderedByPeriod = await this.statisticsModel.aggregate([
      ...this.buildAggregatePeriodParams(shopId, "productsOrdered"),
    ]);

    return {
      name: `Магазин ${shopId}`,
      productsCount: products.length,
      ordersCount: productsOrdered[0].total,
      amount: priceOrdered[0].total,
      maxPricePeriods: maxPricesByPeriod,
      maxOrderedPeriods: maxOrderedByPeriod,
      products,
    };
  }

  buildAggregateSumParams(shopId: number, inputKey: string) {
    return [
      {
        $match: {
          shopId,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              ...this.generateToDobuleQuery(inputKey),
            },
          },
        },
      },
    ];
  }

  buildAggregatePeriodParams(shopId: number, inputKey: string) {
    return [
      {
        $match: {
          shopId,
        },
      },
      {
        $group: {
          _id: "$month",
          max: {
            $max: this.generateToDobuleQuery(inputKey),
          },
        },
      },
    ];
  }

  generateToDobuleQuery(inputKey: string) {
    return {
      $cond: [
        { $eq: [`$${inputKey}`, ""] },
        0,
        {
          $toDouble: {
            $replaceOne: {
              input: `$${inputKey}`,
              find: ",",
              replacement: ".",
            },
          },
        },
      ],
    };
  }

  async getSummaryInfoOfProduct(products: any[]) {}
}
