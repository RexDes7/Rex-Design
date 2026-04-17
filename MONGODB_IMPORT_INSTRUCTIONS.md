# Инструкция по импорту данных в MongoDB Atlas

## Данные экспортированы из SQLite в файл `mongodb-import-data.json`

### Вариант 1: Импорт через VS Code MongoDB Extension

1. Откройте VS Code MongoDB Extension (уже подключено к вашему кластеру)
2. Разверните подключение `portfolio.ursz6ap.mongodb.net`
3. Разверните базу данных `portfolio`
4. Для каждой коллекции:

#### Импорт Users:
- Правый клик на коллекцию `users` → `Insert Document`
- Скопируйте содержимое из `mongodb-import-data.json` секция `users`
- Вставьте и сохраните

#### Импорт Projects:
- Правый клик на коллекцию `projects` → `Insert Document`  
- Скопируйте содержимое из `mongodb-import-data.json` секция `projects`
- Вставьте и сохраните (6 проектов)

#### Импорт Content:
- Правый клик на коллекцию `content` → `Insert Document`
- Скопируйте содержимое из `mongodb-import-data.json` секция `content`
- Вставьте и сохраните

### Вариант 2: Импорт через MongoDB Compass

1. Скачайте и установите MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Подключитесь используя connection string:
   ```
   mongodb+srv://baracudamax1_db_user:8OSuld8nJLRmUezH@portfolio.ursz6ap.mongodb.net/
   ```
3. Выберите базу данных `portfolio`
4. Для каждой коллекции нажмите "ADD DATA" → "Import JSON or CSV file"
5. Выберите файл `mongodb-import-data.json` и импортируйте соответствующие секции

### Вариант 3: Использовать mongoimport (если установлен MongoDB Tools)

```bash
# Импорт users
mongoimport --uri="mongodb+srv://baracudamax1_db_user:8OSuld8nJLRmUezH@portfolio.ursz6ap.mongodb.net/portfolio" --collection=users --file=users.json --jsonArray

# Импорт projects  
mongoimport --uri="mongodb+srv://baracudamax1_db_user:8OSuld8nJLRmUezH@portfolio.ursz6ap.mongodb.net/portfolio" --collection=projects --file=projects.json --jsonArray

# Импорт content
mongoimport --uri="mongodb+srv://baracudamax1_db_user:8OSuld8nJLRmUezH@portfolio.ursz6ap.mongodb.net/portfolio" --collection=content --file=content.json --jsonArray
```

## После импорта

1. Перезапустите dev сервер: `npm run dev`
2. Попробуйте войти в админку: http://localhost:3000/admin/login
   - Email: baracuda.max1@gmail.com
   - Password: Raf070100

## Примечание

Если Node.js все еще не может подключиться (DNS ошибка), но VS Code расширение работает:
- Это проблема с DNS resolver в Node.js на Windows
- Данные уже в MongoDB, сайт должен работать после решения проблемы с подключением
- Возможные решения:
  1. Перезагрузить компьютер
  2. Изменить DNS сервер на 8.8.8.8 (Google DNS)
  3. Отключить VPN/прокси если используется
  4. Проверить файрвол/антивирус
