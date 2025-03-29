import { Controller, Post, Body } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMail(
    @Body() sendMailDto: SendMailDto,
  ): Promise<{ message: string }> {
    await this.mailService.sendMail(sendMailDto);
    return { message: 'Сообщение успешно отправлено' };
  }
}
