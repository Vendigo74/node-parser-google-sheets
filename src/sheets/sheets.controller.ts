import { Controller, Get } from "@nestjs/common";
import { SheetsService } from "./sheets.service";

@Controller("sheets")
export class SheetsController {
  constructor(private sheetsService: SheetsService) {}

  @Get()
  async getJSON() {
    const data = await this.sheetsService.getData2();
    console.log("data in controller is", data);
    return data;
  }
}
