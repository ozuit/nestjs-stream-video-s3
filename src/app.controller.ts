import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { S3Service } from './s3/s3.service';

@Controller()
export class AppController {
  constructor(private readonly s3Service: S3Service) {}

  @Get('/video/:fileName')
  async getVideo(@Res() res: Response, @Param('fileName') fileName: string) {
    const s3ReadStream = await this.s3Service.streamVideo(fileName);
    s3ReadStream.pipe(res);
  }
}
