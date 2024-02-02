import { Injectable } from '@nestjs/common';
const { google } = require("googleapis");

@Injectable()
export class SheetsService {
    async getJSON() {
        const file = `${process.env.GOOGLE_FILE_PATH}`;
        const sheetId = `${process.env.SHEET_ID}`;
        const keyMass: any = {values: 'Отчет'};
        const fun = (data) => {
            const reports = [];
            for (let i = 0; i < data.data.values.length; i++) {
                const item = data.data.values[i];
                if (i === 0) continue;
                const fields = {
                    dateFill: item[0],
                    brand: item[1],
                    item: item[2],
                    season: item[3],
                    collection: item[4],
                    name: item[5],
                    article: item[6],
                    number: item[7],
                    barcode: item[8],
                    size: item[9],
                    contract: item[10],
                    warehouse: item[11],
                    incomes: item[12],
                    orderedCount: item[13],
                    orderedPrice: item[14],
                    buyedCount: item[15],
                    buyedPrice: item[16],
                    remain: item[17],
                    month: item[18],
                    day: item[19],
                    price: item[20],
                    week: item[21],
                    orderedSummary: item[22],
                    turnover: item[23],
                }
                reports.push(fields);
            }
            console.log(reports);
            return JSON.stringify(reports);
        };
        const auth = new google.auth.GoogleAuth({
            keyFile: file,
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        (async () => {
            const client = await auth.getClient();
            //
            const googleSheets = google.sheets({ version: "v4", auth: client });
            //
            const spreadsheetId = sheetId;
            //
            const metaData = await googleSheets.spreadsheets.get({
                auth,
                spreadsheetId,
            });
            //
            const data = {
                auth,
                spreadsheetId,
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: keyMass.change,
                },
            }
            //
            if(keyMass.append) {
                data['range'] = keyMass.append;
                //
                const append = await googleSheets.spreadsheets.values.append(data);
                //
                fun(append);
            } else if(keyMass.values) {
                data['range'] = keyMass.values;
                //
                delete data.valueInputOption; delete data.resource;
                //
                const values = await googleSheets.spreadsheets.values.get(data);
                //
                fun(values); 
            } else if(keyMass.update) {
                data['range'] = keyMass.update;
                //
                const update = await googleSheets.spreadsheets.values.update(data);
                //
                fun(update);
            }
        })();
    }
}
