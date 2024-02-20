import { Injectable } from "@nestjs/common";
import { google } from "googleapis";
import * as fs from "fs";
import { InjectConnection } from "nest-knexjs";
import { ITableData } from "./types/sheet";
import { Knex } from "knex";

@Injectable()
export class SheetsService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getData() {
    const firstTableResponse = await this.parseDocumentData(
      process.env.SHEET_ID_1,
      "Отчёт",
    );
    const secondTableResponse = await this.parseDocumentData(
      process.env.SHEET_ID_2,
      "Отчет",
    );
    const combinedData = [];
    for (let i = 0; i < firstTableResponse.length; i++) {
      const item = firstTableResponse[i];
      if (i === 0) continue;
      if (item[0] === "" && item[1] === "") continue;
      const fields: ITableData = {
        name: item[0],
        brand: item[1],
        platformId: item[2],
        article: item[3],
        productsOrdered: item[5],
        priceOrdered: item[9],
        day: item[4],
        week: item[21],
        month: item[19],
        turnover: item[22],
        shopId: 1,
      };
      combinedData.push(fields);
    }
    for (let i = 0; i < secondTableResponse.length; i++) {
      const item = secondTableResponse[i];
      if (i === 0) continue;
      if (item[0] === "" && item[1] === "") continue;
      const fields: ITableData = {
        name: item[5],
        brand: item[2],
        platformId: item[8],
        article: item[6],
        productsOrdered: item[13],
        priceOrdered: item[22],
        day: item[19],
        week: item[21],
        month: item[18],
        turnover: item[23],
        shopId: 2,
      };
      combinedData.push(fields);
    }
    const jsonString = JSON.stringify(combinedData, null, 2);
    fs.writeFileSync("config/static_data.json", jsonString, "utf8");
    return combinedData;
  }

  async getData2() {
    const tableReadResult = await this.parseDocumentData(
      process.env.SHEET_ID,
      "123",
    );
    const items: ITableData[] = [];
    for (let i = 0; i < tableReadResult.length; i++) {
      const item = tableReadResult[i];
      if (i === 0) continue;
      if (item[0] === "" && item[1] === "") continue;
      const fields: ITableData = {
        name: item[0],
        brand: item[1],
        platformId: item[2],
        article: item[3],
        productsOrdered: item[5],
        priceOrdered: item[9],
        day: item[4],
        week: item[21],
        month: item[19],
        turnover: item[22],
        shopId: 1,
      };
      items.push(fields);
    }
    return items;
  }

  async parseDocumentData(sheetId: string, list: string) {
    const keyFile = `${process.env.GOOGLE_FILE_PATH}`;
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets("v4");
    const sheetsInstance = sheets.spreadsheets.values;
    try {
      const response = await sheetsInstance.get({
        auth,
        spreadsheetId: sheetId,
        range: list, // Specify the range of cells you want to retrieve
      });

      const values = response.data.values;
      console.log("Data from Google Sheet:", values);
      return values;
    } catch (error) {
      console.error("Error reading Google Sheet:", error.message);
    }
  }
}
