import { Injectable } from '@nestjs/common';
import { TransformDto } from './dto/transform.dto';
import axios from 'axios';
import { FileDownloadService } from 'src/download/download.service';

@Injectable()
export class AniganService {
    constructor(
        private downloadService: FileDownloadService
    ) { }

    async transform(transformDto: TransformDto) {
        //Send request to ML server
        const response = await axios.post(
            `${process.env.ML_SERVER_URL}/transform`,
            transformDto,
            {
                responseType: 'text'
            });

        const filename: string = response.data.split("/").pop().replace('"', '')

        this.downloadService.downloadImage(filename, `${process.env.ML_SERVER_URL}/download`)
    }
}
