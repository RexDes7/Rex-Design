# 🚀 Деплой на Vercel

## Подготовка

### 1. Создайте аккаунт на Vercel
- Перейдите на https://vercel.com
- Зарегистрируйтесь через GitHub (рекомендуется)

### 2. Установите Vercel CLI (опционально)
```bash
npm install -g vercel
```

## Способ 1: Деплой через GitHub (Рекомендуется)

### Шаг 1: Создайте Git репозиторий
```bash
git init
git add .
git commit -m "Initial commit"
```

### Шаг 2: Загрузите на GitHub
1. Создайте новый репозиторий на GitHub
2. Подключите локальный репозиторий:
```bash
git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
git branch -M main
git push -u origin main
```

### Шаг 3: Подключите к Vercel
1. Войдите в https://vercel.com/dashboard
2. Нажмите "Add New Project"
3. Выберите ваш GitHub репозиторий
4. Vercel автоматически определит Next.js проект

### Шаг 4: Настройте переменные окружения
В настройках проекта на Vercel добавьте:

```
MONGODB_URI=mongodb://baracudamax1_db_user:8OSuld8nJLRmUezH@ac-wonf5rh-shard-00-00.ursz6ap.mongodb.net:27017,ac-wonf5rh-shard-00-01.ursz6ap.mongodb.net:27017,ac-wonf5rh-shard-00-02.ursz6ap.mongodb.net:27017/?ssl=true&replicaSet=atlas-i4mijt-shard-0&authSource=admin&appName=Portfolio

JWT_SECRET=your-secret-key-change-in-production

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=baracuda.max1@gmail.com
SMTP_PASS=uglm ficp sbks anaq
SMTP_FROM=baracuda.max1@gmail.com
CONTACT_EMAIL=baracuda.max1@gmail.com

NODE_OPTIONS=--dns-result-order=ipv4first
```

⚠️ **ВАЖНО:** Смените `JWT_SECRET` на более безопасный ключ!

### Шаг 5: Деплой
Нажмите "Deploy" - Vercel автоматически:
- Установит зависимости
- Соберет проект
- Задеплоит на production

## Способ 2: Деплой через Vercel CLI

```bash
# Войдите в Vercel
vercel login

# Деплой на production
vercel --prod
```

## После деплоя

### 1. Проверьте сайт
Vercel даст вам URL вида: `https://ваш-проект.vercel.app`

### 2. Настройте домен (опционально)
В настройках проекта на Vercel:
- Settings → Domains
- Добавьте свой домен

### 3. Инициализируйте базу данных
Первый раз зайдите в админ панель:
- `https://ваш-проект.vercel.app/admin/login`
- Логин: `admin@example.com`
- Пароль: `admin123`

⚠️ **Сразу смените пароль!**

## Автоматические деплои

После подключения к GitHub, каждый push в main ветку будет автоматически деплоиться на Vercel!

## Troubleshooting

### Ошибка с MongoDB
- Проверьте что MONGODB_URI правильно скопирован
- Убедитесь что IP адрес Vercel разрешен в MongoDB Atlas (0.0.0.0/0)

### Ошибка с изображениями
- Загруженные изображения хранятся в `/public/uploads`
- На Vercel файловая система read-only
- Рекомендуется использовать Cloudinary или AWS S3

### Ошибка сборки
```bash
# Проверьте локально
npm run build
```

## Полезные ссылки

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
