import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');
const mockSendMail = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: mockSendMail,
});

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    mockSendMail.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  describe('sendMail', () => {
    it('should send email with all fields', async () => {
      mockSendMail.mockResolvedValue({ messageId: '123' });

      await service.sendMail({
        name: 'Иван',
        phone: '+79991234567',
        order_from: 'Москва',
        order_to: 'Тверь',
        trip_type: 'Межгород',
        trip_date: '2026-04-01',
        auto_class: 'Комфорт',
        trip_price_from: '5000',
        additional_info: 'С ребёнком',
        block: 'Калькулятор',
        device_info: 'iPhone 15',
        сurrent_route: 'moskva-tver',
      });

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArg = mockSendMail.mock.calls[0][0];
      expect(callArg.subject).toContain('Иван');
      expect(callArg.html).toContain('Москва');
      expect(callArg.html).toContain('Тверь');
      expect(callArg.html).toContain('+79991234567');
      expect(callArg.html).toContain('Межгород');
      expect(callArg.html).toContain('2026-04-01');
      expect(callArg.html).toContain('Комфорт');
      expect(callArg.html).toContain('5000');
      expect(callArg.html).toContain('С ребёнком');
      expect(callArg.html).toContain('Калькулятор');
      expect(callArg.html).toContain('iPhone 15');
      expect(callArg.html).toContain('moskva-tver');
    });

    it('should send email with minimal fields', async () => {
      mockSendMail.mockResolvedValue({ messageId: '456' });

      await service.sendMail({ name: 'Мария' });

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArg = mockSendMail.mock.calls[0][0];
      expect(callArg.subject).toContain('Мария');
      expect(callArg.html).toContain('Мария');
    });

    it('should omit empty optional fields from HTML', async () => {
      mockSendMail.mockResolvedValue({ messageId: '789' });

      await service.sendMail({ name: 'Тест' });

      const callArg = mockSendMail.mock.calls[0][0];
      // Fields not provided should not appear as labeled sections
      expect(callArg.html).not.toContain('<strong>Телефон</strong>');
      expect(callArg.html).not.toContain('<strong>Откуда</strong>');
      expect(callArg.html).not.toContain('<strong>Куда</strong>');
    });

    it('should throw when transporter fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP connection failed'));

      await expect(
        service.sendMail({ name: 'Ошибка' }),
      ).rejects.toThrow('SMTP connection failed');
    });

    it('should use correct email subject format', async () => {
      mockSendMail.mockResolvedValue({});

      await service.sendMail({ name: 'Клиент' });

      const callArg = mockSendMail.mock.calls[0][0];
      expect(callArg.subject).toBe('Новое сообщение с сайта от Клиент');
    });

    it('should include HTML structure with h1', async () => {
      mockSendMail.mockResolvedValue({});

      await service.sendMail({ name: 'Тест' });

      const callArg = mockSendMail.mock.calls[0][0];
      expect(callArg.html).toContain('<h1>Новое сообщение с сайта</h1>');
    });
  });
});
