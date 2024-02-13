import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Health check')
@Controller()
export class AppController {

    @Get()
    healthCheck() {
        return "Hello World"
    }
}