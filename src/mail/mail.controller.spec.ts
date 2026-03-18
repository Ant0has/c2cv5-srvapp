import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

describe('MailController', () => {
  let controller: MailController;
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMail', () => {
    it('should send mail and return success message', async () => {
      const dto = {
        name: 'Иван',
        phone: '+79991234567',
        from: 'Москва',
        to: 'Тверь',
        date: '2026-04-01',
      };
      const result = await controller.sendMail(dto as any);
      expect(result).toEqual({ message: 'Сообщение успешно отправлено' });
      expect(service.sendMail).toHaveBeenCalledWith(dto);
    });

    it('should propagate error if mail service fails', async () => {
      jest.spyOn(service, 'sendMail').mockRejectedValue(
        new Error('SMTP connection failed'),
      );
      const dto = { name: 'Иван', phone: '+79991234567' };
      await expect(controller.sendMail(dto as any)).rejects.toThrow('SMTP connection failed');
    });
  });
});
