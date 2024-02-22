import { Module } from "@nestjs/common";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { SheetsModule } from "src/sheets/sheets.module";

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [SheetsModule],
})
export class AnalyticsModule {}
