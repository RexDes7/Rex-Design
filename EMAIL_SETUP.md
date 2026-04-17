# Email Setup Guide

Форма контактов теперь отправляет уведомления на email. Для настройки выполните следующие шаги:

## 1. Настройка Gmail (рекомендуется)

### Шаг 1: Включите двухфакторную аутентификацию
1. Перейдите на https://myaccount.google.com/security
2. Включите "2-Step Verification"

### Шаг 2: Создайте пароль приложения
1. Перейдите на https://myaccount.google.com/apppasswords
2. Выберите "Mail" и "Other (Custom name)"
3. Введите название: "Portfolio Contact Form"
4. Скопируйте сгенерированный пароль (16 символов)

### Шаг 3: Настройте переменные окружения
Создайте файл `.env.local` в корне проекта:

```env
JWT_SECRET=your-secret-key-change-in-production

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # App password from step 2
SMTP_FROM=your-email@gmail.com
CONTACT_EMAIL=your-email@gmail.com  # Where to receive contact form submissions
```

## 2. Альтернативные SMTP провайдеры

### Yandex Mail
```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=your-email@yandex.ru
SMTP_PASS=your-password
```

### Mail.ru
```env
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_USER=your-email@mail.ru
SMTP_PASS=your-password
```

### SendGrid (для production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 3. Тестирование

После настройки:
1. Перезапустите сервер разработки: `npm run dev`
2. Откройте страницу контактов: http://localhost:3000/contact
3. Заполните и отправьте форму
4. Проверьте почту - должно прийти уведомление

## 4. Troubleshooting

### Ошибка "Invalid login"
- Проверьте правильность email и пароля
- Для Gmail убедитесь что используете App Password, а не обычный пароль

### Ошибка "Connection timeout"
- Проверьте SMTP_HOST и SMTP_PORT
- Убедитесь что нет блокировки файрволом

### Письма не приходят
- Проверьте папку "Спам"
- Убедитесь что CONTACT_EMAIL указан правильно
- Проверьте логи сервера на наличие ошибок

## 5. Production Deployment

Для production рекомендуется использовать:
- **SendGrid** - 100 писем/день бесплатно
- **Mailgun** - 5000 писем/месяц бесплатно
- **AWS SES** - очень дешево для больших объемов

Не забудьте добавить переменные окружения в настройки хостинга (Vercel, Netlify и т.д.)
