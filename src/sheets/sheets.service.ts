import { Injectable } from "@nestjs/common";
import { google } from "googleapis";

interface ITableData {
  name?: any;
  brand: any;
  platformId: any;
  article: any;
  productsOrdered: any;
  priceOrdered: any;
  day: any;
  week: any;
  month: any;
  turnover: any;
  shopId: any;
}

@Injectable()
export class SheetsService {
  // asy xnc getJSON() {
  //     const file = `${process.env.GOOGLE_FILE_PATH}`;
  //     const sheetId = `${process.env.SHEET_ID}`;
  //     const keyMass: any = {values: 'Отчет'};
  //     const fun = (data) => {
  //         const reports = [];
  //         
  //         console.log(reports);
  //   v      return JSON.stringify(reports);
  //     };
  //     const auth = new google.auth.GoogleAuth({
  //         keyFile: file,
  //         scopes: "https://www.googleapis.com/auth/spreadsheets",
  //     });
  //     (async () => {
  //         const client = await auth.getClient();
  //         //
  //         const googleSheets = google.sheets({ version: "v4", auth: client });
  //         //
  //         const spreadsheetId = sheetId;
  //         //
  //         const metaData = await googleSheets.spreadsheets.get({
  //             auth,
  //             spreadsheetId,
  //         });
  //         //
  //         const data = {
  //             auth,
  //             spreadsheetId,
  //             valueInputOption: "USER_ENTERED",
  //             resource: {
  //                 values: keyMass.change,
  //             },
  //         }
  //         //
  //         if(keyMass.append) {
  //             data['range'] = keyMass.append;
  //             //
  //             const append = await googleSheets.spreadsheets.values.append(data);
  //             //
  //             fun(append);
  //         } else if(keyMass.values) {
  //             data['range'] = keyMass.values;
  //             //
  //             delete data.valueInputOption; delete data.resource;
  //             //
  //             const values = await googleSheets.spreadsheets.values.get(data);
  //             //
  //             fun(values);
  //         } else if(keyMass.update) {
  //             data['range'] = keyMass.update;
  //             //
  //             const update = await googleSheets.spreadsheets.values.update(data);
  //             //
  //             fun(update);
  //         }
  //     })();
  // }

  async getData() {
    const firstTableResponse = await this.readDocument(process.env.SHEET_ID_1, "Отчёт");
    const secondTableResponse = await this.readDocument(process.env.SHEET_ID_2, "Отчет");
    const combinedData = [];
    for (let i = 0; i < firstTableResponse.length; i++) {
      const item = firstTableResponse[i];
      if (i === 0) continue;
      if (item[0] === "" &&  item[1] === "") continue;
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
        shopId: 1
      }
      combinedData.push(fields);
    };
    for (let i = 0; i < secondTableResponse.length; i++) {
      const item = secondTableResponse[i];
      if (i === 0) continue;
      if (item[0] === "" &&  item[1] === "") continue;
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
        shopId: 2
      }
      combinedData.push(fields);
    };
    return combinedData;
  }

  async readDocument(sheetId, list) {
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
