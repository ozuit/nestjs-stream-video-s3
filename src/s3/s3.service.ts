import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3ReadStream } from 's3-readstream';
import { TConfig } from 'src/config/configuration';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3Client: S3;
  private s3Config: TConfig['s3'];

  constructor(private readonly configService: ConfigService<TConfig>) {}

  onModuleInit() {
    this.s3Config = this.configService.get('s3') as TConfig['s3'];
    this.s3Client = new S3({
      endpoint: this.s3Config.endpoint,
      region: this.s3Config.region,
      credentials: {
        accessKeyId: this.s3Config.accessKey,
        secretAccessKey: this.s3Config.secretKey,
      },
    });
  }

  async streamVideo(fileName: string): Promise<S3ReadStream> {
    return new Promise((resolve, reject) => {
      const command = new GetObjectCommand({
        Bucket: this.s3Config.bucketName,
        Key: this.s3Config.path + '/' + fileName,
      });
      try {
        this.s3Client.headObject(command.input, (error, data) => {
          if (error) {
            throw error;
          }
          const options = {
            command,
            s3: this.s3Client,
            maxLength: data.ContentLength,
            byteRange: 1024 * 50,
          };
          const stream = new S3ReadStream(options);
          resolve(stream);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
