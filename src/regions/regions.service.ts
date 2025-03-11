import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './posts.entity';
import { PostMeta } from './post-meta.entity';
import { Regions } from './regions.entity';
import { Routes } from './routes.entity';

const mocRegions = [
  {
    ID: 1,
    post_id: 41,
    meta_key: 'FromRegion',
    meta_id: 2944,
    meta_value: 'Москва',
    region_value: 'Москва и Московская область',
    url: 'taxi777-mezhgorod-moscow',
    address: 'Москва, ул. Промышленная 45, офис 102',
    phone_number: '8 (495) 123-45-67',
  },
  {
    ID: 2,
    post_id: 42,
    meta_key: 'FromRegion',
    meta_id: 2956,
    meta_value: 'Санкт-Петербург',
    region_value: 'Санкт-Петербург и Ленинградская область',
    url: 'taxi78-mezhgorod-piter',
    address: 'Санкт-Петербург, ш. Рыбацкое 12, офис 305',
    phone_number: '8 (812) 234-56-78',
  },
  {
    ID: 3,
    post_id: 43,
    meta_key: 'FromRegion',
    meta_id: 2967,
    meta_value: 'Благовещенск',
    region_value: 'Амурская область',
    url: 'taxi-mezhgorod-blagoveshhensk',
    address: 'Благовещенск, ул. Транспортная 3, офис 207',
    phone_number: '8 (416) 456-78-90',
  },
  {
    ID: 4,
    post_id: 44,
    meta_key: 'FromRegion',
    meta_id: 2981,
    meta_value: 'Архангельск',
    region_value: 'Архангельская область',
    url: 'taxi-mezhgorod-arhangelsk',
    address: 'Архангельск, ул. Лесозаводская 17, офис 104',
    phone_number: '8 (818) 567-89-01',
  },
  {
    ID: 5,
    post_id: 45,
    meta_key: 'FromRegion',
    meta_id: 2996,
    meta_value: 'Барнаул',
    region_value: 'Алтайский край',
    url: 'taxi-mezhgorod-barnaul-22',
    address: 'Барнаул, ул. Машиностроителей 5, офис 309',
    phone_number: '8 (385) 678-90-12',
  },
  {
    ID: 6,
    post_id: 46,
    meta_key: 'FromRegion',
    meta_id: 3011,
    meta_value: 'Астрахань',
    region_value: 'Астраханская область',
    url: 'taxi30-mezhgorod-astrahan',
    address: 'Астрахань, ул. Рыбацкая 22, офис 501',
    phone_number: '8 (851) 789-01-23',
  },
  {
    ID: 7,
    post_id: 47,
    meta_key: 'FromRegion',
    meta_id: 3255,
    meta_value: 'Белгород',
    region_value: 'Белгородская область',
    url: 'taxi-mezhgorod-belgorod',
    address: 'Белгород, ул. Металлургов 10, офис 603',
    phone_number: '8 (472) 890-12-34',
  },
  {
    ID: 8,
    post_id: 48,
    meta_key: 'FromRegion',
    meta_id: 3261,
    meta_value: 'Брянск',
    region_value: 'Брянская область',
    url: 'taxi-mezhgorod-bryansk-32',
    address: 'Брянск, ул. Западная 7, офис 204',
    phone_number: '8 (483) 901-23-45',
  },
  {
    ID: 9,
    post_id: 49,
    meta_key: 'FromRegion',
    meta_id: 3267,
    meta_value: 'Владимир',
    region_value: 'Владимирская область',
    url: 'taxi-mezhgorod-vladimir-33',
    address: 'Владимир, ул. Индустриальная 14, офис 108',
    phone_number: '8 (492) 012-34-56',
  },
  {
    ID: 10,
    post_id: 50,
    meta_key: 'FromRegion',
    meta_id: 3273,
    meta_value: 'Волгоград',
    region_value: 'Волгоградская область',
    url: 'taxi35-mezhgorod-volgograd',
    address: 'Волгоград, Бахурова 12, офис 207',
    phone_number: '8 (844) 261-35-23',
  },
  {
    ID: 11,
    post_id: 51,
    meta_key: 'FromRegion',
    meta_id: 3279,
    meta_value: 'Вологда',
    region_value: 'Вологодская область',
    url: 'taxi-mezhgorod-vologda-34',
    address: 'Вологда, ул. Металлистов 9, офис 402',
    phone_number: '8 (817) 234-56-78',
  },
  {
    ID: 12,
    post_id: 52,
    meta_key: 'FromRegion',
    meta_id: 3285,
    meta_value: 'Воронеж',
    region_value: 'Воронежская область',
    url: 'taxi-mezhgorod-voronezh',
    address: 'Воронеж, ул. Электровозная 18, офис 502',
    phone_number: '8 (473) 345-67-89',
  },
  {
    ID: 13,
    post_id: 53,
    meta_key: 'FromRegion',
    meta_id: 3291,
    meta_value: 'Биробиджан',
    region_value: 'Еврейская автономная область',
    url: 'taxi-mezhgorod-birobidzhan-79',
    address: 'Биробиджан, ул. Дальневосточная 6, офис 201',
    phone_number: '8 (426) 456-78-90',
  },
  {
    ID: 14,
    post_id: 54,
    meta_key: 'FromRegion',
    meta_id: 3297,
    meta_value: 'Чита',
    region_value: 'Забайкальский край',
    url: 'taxi-mezhgorod-chita',
    address: 'Чита, ул. Шахтерская 11, офис 304',
    phone_number: '8 (302) 567-89-01',
  },
  {
    ID: 15,
    post_id: 55,
    meta_key: 'FromRegion',
    meta_id: 3303,
    meta_value: 'Иваново',
    region_value: 'Ивановская область',
    url: 'taxi-mezhgorod-ivanovo-37',
    address: 'Иваново, ул. Прядильная 4, офис 105',
    phone_number: '8 (493) 678-90-12',
  },
  {
    ID: 16,
    post_id: 56,
    meta_key: 'FromRegion',
    meta_id: 3309,
    meta_value: 'Иркутск',
    region_value: 'Иркутская область',
    url: 'taxi-mezhgorod-irkutsk',
    address: 'Иркутск, ул. Гидростроителей 20, офис 407',
    phone_number: '8 (395) 789-01-23',
  },
  {
    ID: 17,
    post_id: 57,
    meta_key: 'FromRegion',
    meta_id: 3315,
    meta_value: 'Краснодар',
    region_value: 'Краснодарский край',
    url: 'taxi23-mezhgorod-kk',
    address: 'Краснодар, ул. Элеваторная 13, офис 601',
    phone_number: '8 (861) 890-12-34',
  },
  {
    ID: 18,
    post_id: 58,
    meta_key: 'FromRegion',
    meta_id: 3321,
    meta_value: 'Красноярск',
    region_value: 'Красноярский край',
    url: 'taxi-mezhgorod-krasnojarsk',
    address: 'Красноярск, ул. Металлургическая 30, офис 703',
    phone_number: '8 (391) 901-23-45',
  },
  {
    ID: 19,
    post_id: 59,
    meta_key: 'FromRegion',
    meta_id: 3327,
    meta_value: 'Калуга',
    region_value: 'Калужская область',
    url: 'taxi-mezhgorod-kaluga-39',
    address: 'Калуга, ул. Заводская 8, офис 202',
    phone_number: '8 (484) 012-34-56',
  },
  {
    ID: 20,
    post_id: 60,
    meta_key: 'FromRegion',
    meta_id: 3333,
    meta_value: 'Кемерово',
    region_value: 'Кемеровская область',
    url: 'taxi-mezhgorod-kemerovo-42',
    address: 'Кемерово, ул. Шахтерская 5, офис 404',
    phone_number: '8 (384) 123-45-67',
  },
  {
    ID: 21,
    post_id: 61,
    meta_key: 'FromRegion',
    meta_id: 3339,
    meta_value: 'Киров',
    region_value: 'Кировская область',
    url: 'taxi-mezhgorod-kirov-43',
    address: 'Киров, ул. Лесопилная 2, офис 306',
    phone_number: '8 (833) 234-56-78',
  },
  {
    ID: 22,
    post_id: 62,
    meta_key: 'FromRegion',
    meta_id: 3345,
    meta_value: 'Кострома',
    region_value: 'Костромская область',
    url: 'taxi-mezhgorod-kostroma-44',
    address: 'Кострома, ул. Текстильная 10, офис 107',
    phone_number: '8 (494) 345-67-89',
  },
  {
    ID: 23,
    post_id: 63,
    meta_key: 'FromRegion',
    meta_id: 3351,
    meta_value: 'Курган',
    region_value: 'Курганская область',
    url: 'taxi-mezhgorod-kurgan-45',
    address: 'Курган, ул. Машиностроителей 7, офис 205',
    phone_number: '8 (352) 456-78-90',
  },
  {
    ID: 24,
    post_id: 64,
    meta_key: 'FromRegion',
    meta_id: 3357,
    meta_value: 'Курск',
    region_value: 'Курская область',
    url: 'taxi-mezhgorod-kursk-46',
    address: 'Курск, ул. Энергетиков 12, офис 303',
    phone_number: '8 (471) 567-89-01',
  },
  {
    ID: 25,
    post_id: 65,
    meta_key: 'FromRegion',
    meta_id: 3363,
    meta_value: 'Липецк',
    region_value: 'Липецкая область',
    url: 'taxi-mezhgorod-lipeck-48',
    address: 'Липецк, ул. Металлургов 25, офис 408',
    phone_number: '8 (474) 678-90-12',
  },
  {
    ID: 26,
    post_id: 66,
    meta_key: 'FromRegion',
    meta_id: 3472,
    meta_value: 'Мурманск',
    region_value: 'Мурманская область',
    url: 'taxi-mezhgorod-murmansk-51',
    address: 'Мурманск, ул. Портовое шоссе 3, офис 101',
    phone_number: '8 (815) 789-01-23',
  },
  {
    ID: 27,
    post_id: 67,
    meta_key: 'FromRegion',
    meta_id: 3478,
    meta_value: 'Нижний Новгород',
    region_value: 'Нижегородская область',
    url: 'taxi-mezhgorod-nizhniy_novgorod',
    address: 'Нижний Новгород, ул. Автозаводская 20, офис 504',
    phone_number: '8 (831) 890-12-34',
  },
  {
    ID: 28,
    post_id: 68,
    meta_key: 'FromRegion',
    meta_id: 3484,
    meta_value: 'Великий Новгород',
    region_value: 'Новгородская область',
    url: 'taxi-mezhgorod-velikiy-novgorod-53',
    address: 'Великий Новгород, ул. Промышленная 6, офис 203',
    phone_number: '8 (816) 901-23-45',
  },
  {
    ID: 29,
    post_id: 69,
    meta_key: 'FromRegion',
    meta_id: 3490,
    meta_value: 'Новосибирск',
    region_value: 'Новосибирская область',
    url: 'taxi-mezhgorod-novosibirsk-54',
    address: 'Новосибирск, ул. Научная 15, офис 701',
    phone_number: '8 (383) 012-34-56',
  },
  {
    ID: 30,
    post_id: 70,
    meta_key: 'FromRegion',
    meta_id: 3496,
    meta_value: 'Пенза',
    region_value: 'Пензенская область',
    url: 'taxi58-mezhgorod-penza',
    address: 'Пенза, ул. Заводское шоссе 9, офис 304',
    phone_number: '8 (841) 123-45-67',
  },
  {
    ID: 31,
    post_id: 71,
    meta_key: 'FromRegion',
    meta_id: 3502,
    meta_value: 'Псков',
    region_value: 'Псковская область',
    url: 'taxi60-mezhgorod-pskov',
    address: 'Псков, ул. Инженерная 4, офис 106',
    phone_number: '8 (811) 234-56-78',
  },
  {
    ID: 32,
    post_id: 72,
    meta_key: 'FromRegion',
    meta_id: 3508,
    meta_value: 'Пермь',
    region_value: 'Пермский край',
    url: 'taxi59-mezhgorod-perm',
    address: 'Пермь, ул. Нефтяников 18, офис 405',
    phone_number: '8 (342) 345-67-89',
  },
  {
    ID: 33,
    post_id: 73,
    meta_key: 'FromRegion',
    meta_id: 3514,
    meta_value: 'Владивосток',
    region_value: 'Приморский край',
    url: 'taxi-mezhgorod-vladivostok',
    address: 'Владивосток, ул. Рыбацкая 11, офис 606',
    phone_number: '8 (423) 456-78-90',
  },
  {
    ID: 34,
    post_id: 74,
    meta_key: 'FromRegion',
    meta_id: 3520,
    meta_value: 'Омск',
    region_value: 'Омская область',
    url: 'taxi-mezhgorod-omsk-55',
    address: 'Омск, ул. Транспортная 14, офис 307',
    phone_number: '8 (381) 567-89-01',
  },
  {
    ID: 35,
    post_id: 75,
    meta_key: 'FromRegion',
    meta_id: 3526,
    meta_value: 'Оренбург',
    region_value: 'Оренбургская область',
    url: 'taxi-mezhgorod-orenburg-56',
    address: 'Оренбург, ул. Газовая 5, офис 208',
    phone_number: '8 (353) 678-90-12',
  },
  {
    ID: 36,
    post_id: 76,
    meta_key: 'FromRegion',
    meta_id: 3532,
    meta_value: 'Орёл',
    region_value: 'Орловская область',
    url: 'taxi-mezhgorod-orel-57',
    address: 'Орёл, ул. Машиностроителей 3, офис 102',
    phone_number: '8 (486) 789-01-23',
  },
  {
    ID: 37,
    post_id: 77,
    meta_key: 'FromRegion',
    meta_id: 3538,
    meta_value: 'Ростов',
    region_value: 'Ростовская область',
    url: 'taxi61-mezhgorod-ro',
    address: 'Ростов-на-Дону, ул. Портовая 7, офис 404',
    phone_number: '8 (863) 890-12-34',
  },
  {
    ID: 38,
    post_id: 78,
    meta_key: 'FromRegion',
    meta_id: 3544,
    meta_value: 'Рязань',
    region_value: 'Рязанская область',
    url: 'taxi-mezhgorod-ryazan-62',
    address: 'Рязань, ул. Химиков 12, офис 305',
    phone_number: '8 (491) 901-23-45',
  },
  {
    ID: 39,
    post_id: 79,
    meta_key: 'FromRegion',
    meta_id: 3550,
    meta_value: 'Майкоп',
    region_value: null,
  },
  {
    ID: 40,
    post_id: 80,
    meta_key: 'FromRegion',
    meta_id: 3556,
    meta_value: 'Уфа',
    region_value: 'Республика Башкортостан',
    url: '102-taxi-mezhgorod-ufa',
    address: 'Уфа, ул. Нефтяная 25, офис 503',
    phone_number: '8 (347) 123-45-67',
  },
  {
    ID: 41,
    post_id: 81,
    meta_key: 'FromRegion',
    meta_id: 3562,
    meta_value: 'Улан-Удэ',
    region_value: 'Республика Бурятия',
    url: 'taxi-mezhgorod-ulan-ude-03',
    address: 'Улан-Удэ, ул. Железнодорожная 8, офис 306',
    phone_number: '8 (301) 234-56-78',
  },
  {
    ID: 42,
    post_id: 82,
    meta_key: 'FromRegion',
    meta_id: 3568,
    meta_value: 'Элиста',
    region_value: 'Республика Калмыкия',
    url: 'taxi-mezhgorod-elista-08',
    address: 'Элиста, ул. Степная 5, офис 104',
    phone_number: '8 (847) 345-67-89',
  },
  {
    ID: 43,
    post_id: 83,
    meta_key: 'FromRegion',
    meta_id: 3678,
    meta_value: 'Петрозаводск',
    region_value: 'Республика Карелия',
    url: 'taxi-mezhgorod-petrozavodsk',
    address: 'Петрозаводск, ул. Лесозаводская 4, офис 202',
    phone_number: '8 (814) 456-78-90',
  },
  {
    ID: 44,
    post_id: 84,
    meta_key: 'FromRegion',
    meta_id: 3684,
    meta_value: 'Сыктывкар',
    region_value: 'Республика Коми',
    url: 'taxi-mezhgorod-syktyvkar',
    address: 'Сыктывкар, ул. Нефтяников 7, офис 303',
    phone_number: '8 (821) 567-89-01',
  },
  {
    ID: 45,
    post_id: 85,
    meta_key: 'FromRegion',
    meta_id: 3690,
    meta_value: 'Крым и Новые Территории',
    region_value: 'Республика Крым',
    url: 'https://city2city.ru/82-mezhgorod-krym.html',
    address: 'Симферополь, ул. Заводская 8, офис 401',
    phone_number: '8 (365) 345-67-89',
  },
  {
    ID: 46,
    post_id: 86,
    meta_key: 'FromRegion',
    meta_id: 3696,
    meta_value: 'Йошкар-Ола',
    region_value: 'Республика Марий Эл',
    url: 'taxi-mezhgorod-yoshkar-ola-12',
    address: 'Йошкар-Ола, ул. Машиностроительная 9, офис 105',
    phone_number: '8 (836) 678-90-12',
  },
  {
    ID: 47,
    post_id: 87,
    meta_key: 'FromRegion',
    meta_id: 3702,
    meta_value: 'Саранск',
    region_value: 'Республика Мордовия',
    url: 'taxi-mezhgorod-saransk-13',
    address: 'Саранск, ул. Заводская 6, офис 401',
    phone_number: '8 (834) 789-01-23',
  },
  {
    ID: 48,
    post_id: 88,
    meta_key: 'FromRegion',
    meta_id: 3708,
    meta_value: 'Якутск',
    region_value: 'Республика Саха (Якутия)',
    url: 'taxi-mezhgorod-yakutsk-14',
    address: 'Якутск, ул. Кульджинская 9, офис 501',
    phone_number: '8 (411) 234-56-78',
  },
  {
    ID: 49,
    post_id: 89,
    meta_key: 'FromRegion',
    meta_id: 3714,
    meta_value: 'Казань',
    region_value: 'Республика Татарстан',
    url: 'taxi-mezhgorod-kazan',
    address: 'Казань, ул. Комсомольская 2, офис 309',
    phone_number: '8 (843) 567-89-01',
  },
  {
    ID: 50,
    post_id: 90,
    meta_key: 'FromRegion',
    meta_id: 3720,
    meta_value: 'Кызыл',
    region_value: 'Республика Тыва',
    url: 'taxi-mezhgorod-kyzyl-15',
    address: 'Кызыл, ул. Сибрисская 10, офис 405',
    phone_number: '8 (394) 901-23-45',
  },
  {
    ID: 51,
    post_id: 91,
    meta_key: 'FromRegion',
    meta_id: 3726,
    meta_value: 'Южно-Сахалинск',
    region_value: 'Сахалинская область',
    url: 'taxi-mezhgorod-yuzhno-sakhalinsk-22',
    address: 'Южно-Сахалинск, ул. Пограничная 8, офис 404',
    phone_number: '8 (424) 123-45-67',
  },
  {
    ID: 52,
    post_id: 92,
    meta_key: 'FromRegion',
    meta_id: 3732,
    meta_value: 'Самара',
    region_value: 'Самарская область',
    url: 'taxi-mezhgorod-samara-20',
    address: 'Самара, ул. Профессиональная 5, офис 302',
    phone_number: '8 (846) 123-45-67',
  },
  {
    ID: 53,
    post_id: 93,
    meta_key: 'FromRegion',
    meta_id: 3738,
    meta_value: 'Саратов',
    region_value: 'Саратовская область',
    url: 'taxi-mezhgorod-saratov-21',
    address: 'Саратов, ул. Строителей 4, офис 306',
    phone_number: '8 (845) 567-89-01',
  },
  {
    ID: 54,
    post_id: 94,
    meta_key: 'FromRegion',
    meta_id: 3744,
    meta_value: 'Смоленск',
    region_value: 'Смоленская область',
    url: 'taxi-mezhgorod-smolensk-24',
    address: 'Смоленск, ул. Солнечная 2, офис 507',
    phone_number: '8 (481) 678-90-12',
  },
  {
    ID: 55,
    post_id: 95,
    meta_key: 'FromRegion',
    meta_id: 3750,
    meta_value: 'Екатеринбург',
    region_value: 'Свердловская область',
    url: 'taxi-mezhgorod-ekaterinburg-23',
    address: 'Екатеринбург, ул. Космонавтов 15, офис 301',
    phone_number: '8 (343) 234-56-78',
  },
  {
    ID: 56,
    post_id: 96,
    meta_key: 'FromRegion',
    meta_id: 3756,
    meta_value: 'Ставрополь',
    region_value: 'Ставропольский край',
    url: 'taxi-mezhgorod-stavropol',
    address: 'Ставрополь, ул. Садовая17, офис 9',
    phone_number: '8 (865) 789-01-23',
  },
  {
    ID: 57,
    post_id: 97,
    meta_key: 'FromRegion',
    meta_id: 3762,
    meta_value: 'Тамбов',
    region_value: 'Тамбовская область',
    url: 'taxi-mezhgorod-tambov-25',
    address: 'Тамбов, ул. Лесопарковая 5, офис 408',
    phone_number: '8 (475) 789-01-23',
  },
  {
    ID: 58,
    post_id: 98,
    meta_key: 'FromRegion',
    meta_id: 3768,
    meta_value: 'Томск',
    region_value: 'Томская область',
    url: 'taxi-mezhgorod-tomsk-27',
    address: 'Томск, ул. Гоголя 9, офис 301',
    phone_number: '8 (382) 234-56-78',
  },
  {
    ID: 59,
    post_id: 99,
    meta_key: 'FromRegion',
    meta_id: 3774,
    meta_value: 'Тверь',
    region_value: 'Тверская область',
    url: 'taxi-mezhgorod-tver-69',
    address: 'Тверь, ул. Береговая12, офис 4',
    phone_number: '8 (482) 012-34-56',
  },
  {
    ID: 60,
    post_id: 100,
    meta_key: 'FromRegion',
    meta_id: 3885,
    meta_value: 'Тула',
    region_value: 'Тульская область',
    url: 'taxi-mezhgorod-tula-28',
    address: 'Тула, ул. Кремлевская 8, офис 502',
    phone_number: '8 (487) 345-67-89',
  },
  {
    ID: 61,
    post_id: 101,
    meta_key: 'FromRegion',
    meta_id: 3891,
    meta_value: 'Тюмень',
    region_value: 'Тюменская область',
    url: 'taxi-mezhgorod-tyumen-29',
    address: 'Тюмень, ул. Промышленная 7, офис 303',
    phone_number: '8 (345) 567-89-01',
  },
  {
    ID: 62,
    post_id: 102,
    meta_key: 'FromRegion',
    meta_id: 3897,
    meta_value: 'Ульяновск',
    region_value: 'Ульяновская область',
    url: 'taxi-mezhgorod-uljanovsk-31',
    address: 'Ульяновск, ул. Пионерская 3, офис 506',
    phone_number: '8 (842) 345-67-89',
  },
  {
    ID: 63,
    post_id: 103,
    meta_key: 'FromRegion',
    meta_id: 3903,
    meta_value: 'Ижевск',
    region_value: 'Удмуртская Республика',
    url: 'taxi-mezhgorod-izhevsk-30',
    address: 'Ижевск, ул. Транспортная 12, офис 204',
    phone_number: '8 (341) 234-56-78',
  },
  {
    ID: 64,
    post_id: 104,
    meta_key: 'FromRegion',
    meta_id: 3909,
    meta_value: 'Хабаровск',
    region_value: 'Хабаровский край',
    url: 'taxi-mezhgorod-khabarovsk-32',
    address: 'Хабаровск, ул. Гоголя 14, офис 309',
    phone_number: '8 (421) 567-89-01',
  },
  {
    ID: 65,
    post_id: 105,
    meta_key: 'FromRegion',
    meta_id: 3915,
    meta_value: 'Ханты-Мансийск',
    region_value: 'Ханты-Мансийский автономный округ',
    url: 'taxi86-mezhgorod-hanty_mansiysk',
    address: 'Ханты-Мансийск, ул. Геологическая4, офис 3',
    phone_number: '8 (346) 678-90-12',
  },
  {
    ID: 66,
    post_id: 106,
    meta_key: 'FromRegion',
    meta_id: 3921,
    meta_value: 'Челябинск',
    region_value: 'Челябинская область',
    url: 'taxi-mezhgorod-chelyabinsk-33',
    address: 'Челябинск, ул. Строителей 19, офис 402',
    phone_number: '8 (351) 345-67-89',
  },
  {
    ID: 67,
    post_id: 107,
    meta_key: 'FromRegion',
    meta_id: 3927,
    meta_value: 'Чебоксары',
    region_value: 'Чувашская Республика',
    url: 'taxi-mezhgorod-cheboksary-21',
    address: 'Чебоксары, ул. Тракторостроителей6, офис 7',
    phone_number: '8 (835) 890-12-34',
  },
  {
    ID: 68,
    post_id: 150658,
    meta_key: 'FromRegion',
    meta_id: 694772,
    meta_value: 'Крым и Новые Территории',
    region_value: 'Республика Крым',
    url: '82-mezhgorod-krym',
    address: 'Симферополь, ул. Заводская 8, офис 401',
    phone_number: '8 (365) 345-67-89',
  },
  {
    ID: 69,
    post_id: 188788,
    meta_key: 'FromRegion',
    meta_id: 753336,
    meta_value: 'Ярославль',
    region_value: 'Ярославская область',
    url: 'taxi-mezhgorod-yaroslavl-36',
    address: 'Ярославль, ул. Островская 4, офис 603',
    phone_number: '8 (485) 678-90-12',
  },
];

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,

    @InjectRepository(PostMeta)
    private postMetaRepository: Repository<PostMeta>,

    @InjectRepository(Regions)
    private regionsRepository: Repository<Regions>,

    @InjectRepository(Routes)
    private routesRepository: Repository<Routes>,
  ) {}

  async getRegions(): Promise<any> {
    return mocRegions;
  }

  getPosts(): Promise<Posts[]> {
    return this.postsRepository.find({
      where: {
        ID: 41,
      },
    });
  }

  async createRegions(): Promise<any> {
    for (const region of mocRegions) {
      const newRegion = this.regionsRepository.create({
        meta_id: region?.meta_id,
        post_id: region?.post_id,
        meta_key: region?.meta_key,
        meta_value: region?.meta_value,
        region_value: region?.region_value,
        address: region?.address,
        url: region?.url,
        phone_number: region?.phone_number,
      });

      await this.regionsRepository.save(newRegion);
    }

    return 'regions successfully created';
  }

  async getTrueRegions(): Promise<any> {
    return this.regionsRepository.find();
  }

  async addRoutesByRegion(url: string): Promise<any> {
    const targetRegion = await this.regionsRepository.find({
      where: {
        url,
      },
    });
    if (targetRegion && targetRegion.length > 0) {
      const region = targetRegion[0];
      const regionsData = await this.postMetaRepository.find({
        where: {
          meta_key: 'FromRegion',
          meta_value: region?.meta_value,
        },
      });

      if (regionsData && regionsData?.length > 0) {
        const postIdList = regionsData.map((el) => ({
          post_id: el?.post_id,
        }));

        const resultList = [];

        for (let k = 0; k < postIdList.length; k++) {
          const post_id = postIdList[k]?.post_id;

          const targetPosts = await this.postsRepository.find({
            where: {
              ID: post_id,
            },
          });

          const readyObject = {};

          if (targetPosts && targetPosts?.length > 0) {
            const post = targetPosts[0];
            readyObject['title'] = post?.post_title;
            readyObject['content'] = post?.post_content;
            readyObject['post_id'] = post?.ID;
            readyObject['url'] = post?.post_name;
            readyObject['region_id'] = region?.ID;
          }
          resultList.push(readyObject);
        }
        console.log('resultList', resultList);
        for (const result of resultList) {
          const targetRoute = this.routesRepository.find({
            where: {
              title: result?.title,
            },
          });
          if (!targetRoute) {
            console.log('result', result);
            const res = this.routesRepository.create(result);
            console.log('res', res);
            await this.routesRepository.save(res);
          } else {
            console.log('такой маршрут уже добавлен ->', result);
          }
        }
      }
    } else {
      return 'не пришел url';
    }

    return this.routesRepository.find();
  }

  async getRoutes(): Promise<any> {
    return this.routesRepository.find();
  }
}
