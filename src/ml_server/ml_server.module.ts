import { Module } from '@nestjs/common';
import { MlServerService } from './ml_server.service';

@Module({
  providers: [MlServerService]
})
export class MlServerModule { }
