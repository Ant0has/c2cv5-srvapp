import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true, // true для 465, false для других портов
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(data: {
    name?: string;
    phone?: string;
    block?: string;
    device_info?: string;
    trip_date?: string;
    additional_info?: string;
    auto_class?: string;
    order_from?: string;
    order_to?: string;
    trip_price_from?: string;
    trip_type?: string;
  }): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL, // ваша почта
      subject: `Новое сообщение с сайта от ${data.name}`,
      html: `
        <h1>Новое сообщение с сайта</h1>
        ${data.trip_type ? `<p><strong>Заказ</strong> - ${data.trip_type}</p>` : ''}
        ${data.trip_date ? `<p><strong>Дата</strong> - ${data.trip_date}</p>` : ''}
        ${data.order_from ? `<p><strong>Откуда</strong> - ${data.order_from}</p>` : ''}
        ${data.order_to ? `<p><strong>Куда</strong> - ${data.order_to}</p>` : ''}
        ${data.name ? `<p><strong>Имя</strong> - ${data.name}</p>` : ''}
        ${data.phone ? `<p><strong>Телефон</strong> - ${data.phone}</p>` : ''}
        ${data.auto_class ? `<p><strong>Класс авто</strong> - ${data.auto_class}</p>` : ''}
        ${data.trip_price_from ? `<p><strong>Цена поездки от</strong> - ${data.trip_price_from}</p>` : ''}
        ${data.additional_info ? `<p><strong>Дополнительная информация</strong> - ${data.additional_info}</p>` : ''}
        ${data.block ? `<p><strong>Блок на сайте</strong> - ${data.block}</p>` : ''}
        ${data.device_info ? `<p><strong>Информация об устройстве:</strong> - ${data.device_info}</p>` : ''}
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
