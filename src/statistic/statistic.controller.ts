import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
    constructor(private statisticService: StatisticService) {}

    @Get()
    async getJSON() {
        const data = await this.statisticService.getFile();
        console.log("data in controller is", data);
        return data;
}}
