import { Body, Post, Controller } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post("/parse-to-db")
  async parseToDby(@Body() body: any) {
    await this.analyticsService.parseSheetToDb();
    return "ok";
  }
}
