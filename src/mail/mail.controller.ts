import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';

@ApiTags('Почта')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiOperation({ summary: 'Отправить заявку на email' })
  async sendMail(
    @Body() sendMailDto: SendMailDto,
  ): Promise<{ message: string }> {
    await this.mailService.sendMail(sendMailDto);
    return { message: 'Сообщение успешно отправлено' };
  }
}
