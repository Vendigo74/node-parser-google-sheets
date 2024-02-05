import { Controller, Get } from "@nestjs/common";
import { StatisticService } from "./statistic.service";

@Controller("statistic")
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get()
  async getJSON() {
    const data = await this.statisticService.getFile("config/static_data.json");
    console.log("data in controller is", data);
    return data;
  }

  @Get("/prepare")
  async prepareJson() {
    return "already prepared";
  }

  @Get("/get-prepared")
  async getPreared() {
    return await this.statisticService.getStatisticsInfo();
  }
}
