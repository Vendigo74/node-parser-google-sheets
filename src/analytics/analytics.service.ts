import { Injectable } from "@nestjs/common";
import { InjectConnection } from "nest-knexjs";
import { Knex } from "knex";
import { SheetsService } from "src/sheets/sheets.service";
import { ITableData } from "src/sheets/types/sheet";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private sheetsService: SheetsService,
  ) {}

  async parseSheetToDb() {
    const data = await this.sheetsService.getData2();
    await this.removeTable();
    await this.createTable();
    await this.insertData(data);
    return data;
  }

  async createTable() {
    await this.knex.schema.createTableIfNotExists(
      "test_table",
      function (table) {
        table.increments("id");
        table.string("name", 400);
        table.string("brand", 400);
        table.string("platformId");
        table.string("article");
        table.integer("productsOrdered");
        table.float("priceOrdered");
        table.date("day");
        table.string("week");
        table.string("month");
        table.string("turnover");
        table.integer("shopId");
      },
    );
  }

  async insertData(parsedRows: ITableData[] = []) {
    console.log("start isnert");
    let i = 0;
    // for (const row of parsedRows) {
    //
    //
    //   await this.knex("test_table").insert(preparedRow);
    //   i++;
    //   if (i >= parsedRows.length) {
    //     break;
    //   }
    // }
    const CHUNK_SIZE = 1000; // Adjust based on your environment. 1000 is a commonly used value.

    for (let i = 0; i < parsedRows.length; i += CHUNK_SIZE) {
      const chunk = parsedRows.slice(i, i + CHUNK_SIZE);
      await this.knex.batchInsert("test_table", chunk);
    }
  }

  async removeTable() {
    await this.knex.schema.dropTableIfExists("test_table");
  }
}
