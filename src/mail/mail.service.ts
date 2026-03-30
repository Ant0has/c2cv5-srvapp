import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);
  private readonly CRM_API = process.env.CRM_LEADS_API || 'https://chat.city2city.ru/api/public/leads';
  private readonly CRM_API_KEY = process.env.CRM_LEADS_API_KEY || 'c2c-miniapp-2026';

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
    сurrent_route?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    landing_page?: string;
    referrer?: string;
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
        ${data.сurrent_route ? `<p><strong>Текущий маршрут</strong> - ${data.сurrent_route}</p>` : ''}
        ${data.additional_info ? `<p><strong>Дополнительная информация</strong> - ${data.additional_info}</p>` : ''}
        ${data.block ? `<p><strong>Блок на сайте</strong> - ${data.block}</p>` : ''}
        ${data.device_info ? `<p><strong>Информация об устройстве:</strong> - ${data.device_info}</p>` : ''}
        ${data.utm_source ? `<p><strong>UTM Source:</strong> ${data.utm_source}</p>` : ''}
        ${data.utm_medium ? `<p><strong>UTM Medium:</strong> ${data.utm_medium}</p>` : ''}
        ${data.utm_campaign ? `<p><strong>UTM Campaign:</strong> ${data.utm_campaign}</p>` : ''}
        ${data.landing_page ? `<p><strong>Landing Page:</strong> ${data.landing_page}</p>` : ''}
      `,
    };

    await this.transporter.sendMail(mailOptions);

    // Создаём лид в CRM
    this.createCrmLead(data).catch((e) =>
      this.logger.warn('CRM lead creation failed: ' + e.message)
    );
  }

  private async createCrmLead(data: {
    name?: string; phone?: string; order_from?: string; order_to?: string;
    trip_date?: string; auto_class?: string; trip_price_from?: string;
    additional_info?: string; сurrent_route?: string;
    utm_source?: string; utm_medium?: string; utm_campaign?: string;
    utm_content?: string; utm_term?: string; landing_page?: string; referrer?: string;
  }) {
    if (!data.phone) return;

    const carClassMap: Record<string, string> = {
      'Комфорт': 'COMFORT', 'Комфорт+': 'COMFORT_PLUS',
      'Бизнес': 'BUSINESS', 'Минивэн': 'MINIVAN', 'МИНИВЭН': 'MINIVAN',
    };

    const body = {
      source: 'city2city.ru',
      fromAddress: data.order_from || 'Не указано',
      toAddress: data.order_to || 'Не указано',
      tripDatetime: data.trip_date || undefined,
      clientPhone: data.phone,
      clientName: data.name || undefined,
      carClass: data.auto_class ? (carClassMap[data.auto_class] || data.auto_class) : undefined,
      totalPrice: data.trip_price_from ? parseInt(data.trip_price_from.replace(/\D/g, '')) || undefined : undefined,
      comment: data.additional_info || undefined,
      utmSource: data.utm_source || undefined,
      utmMedium: data.utm_medium || undefined,
      utmCampaign: data.utm_campaign || undefined,
      utmContent: data.utm_content || undefined,
      utmTerm: data.utm_term || undefined,
      landingPage: data.landing_page || undefined,
      referrer: data.referrer || undefined,
    };

    const res = await fetch(this.CRM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': this.CRM_API_KEY },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`CRM API ${res.status}`);
    this.logger.log(`CRM lead created for ${data.phone}`);
  }
}
