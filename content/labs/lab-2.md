## 1 Тема, Мета, Посилання

### 1.1 Тема
Тема: «СТВОРЕННЯ БАЗИ ДАНИХ У MYSQL. ПІДКЛЮЧЕННЯ NODE.JS ДО MYSQL. РОБОТА З ORM SEQUELIZE».

### 1.2 Мета
Мета: Створити базу даних для роботи програмного забезпечення, створеного у лабораторній роботі №1 і налагодити його роботу зі сховищем даних за допомогою ORM Sequelize

### 1.3 Розташування
- Репозиторій власного веб-застосунку (GitHub): [Посилання](https://github.com/xXx-GloriousPhoenix-xXx/IP-34_appBack-PrikhodjkoRoman-FIOT-2026)
- Власний веб-застосунок (Жива сторінка): [Посилання](https://xXx-GloriousPhoenix-xXx.github.io/IP-34_appBack-PrikhodjkoRoman-FIOT-2026/)
- Репозиторій звітного HTML-документа (GitHub): [Посилання](https://github.com/xXx-GloriousPhoenix-xXx/IP-34_appRecord-PrikhodjkoRoman-FIOT-2026)
- Звітний HTML-документ (Жива сторінка): [Посилання](https://xXx-GloriousPhoenix-xXx.github.io/IP-34_appRecord-PrikhodjkoRoman-FIOT-2026/)

---

## 2. Створення бази даних
![Components](/assets/labs/lab-2/CreateDB.png)
**Рис. 1 - Створення БД.**

---

## 3. Створення моделей

### 3.1 ER
![ER](/assets/labs/lab-1/ER.png)
**Рис. 2 - ER діаграма**

### 3.1 Приклад моделі
![Model](/assets/labs/lab-2/BookingModel.png)
**Рис. 3 - Модель бронювання.**

### 3.2 Booking Model
```
BookingModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });
BookingModel.belongsTo(WorkspaceModel, { foreignKey: 'workspace_id', as: 'workspace' });
UserModel.hasMany(BookingModel, { foreignKey: 'user_id', as: 'bookings' });
WorkspaceModel.hasMany(BookingModel, { foreignKey: 'workspace_id', as: 'bookings' });
```

### 3.3 Subscription Model
```
SubscriptionModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });
UserModel.hasMany(SubscriptionModel, { foreignKey: 'user_id', as: 'subscriptions' });
```

### 3.4 Використання Sequelize
```
UserModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        full_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        registration_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        has_debt: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: false,
    }
);
```

---

## 4 Зв'язок з БД
```
import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env['DATABASE_URL']!, {
    dialect: 'postgres',
    logging: process.env['NODE_ENV'] === 'development' ? console.log : false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
```

---

## 5 Сервіс користувача
```
import type { UserEntity } from '../entities/userEntity.js';
import type { CreateUserModel } from '../models/createUserModel.js';
import { UserModel } from '../database/index.js';

export class UserService {

    async createUser(data: CreateUserModel): Promise<UserEntity> {
        // Перевірка віку (бізнес-логіка: мінімальний вік для реєстрації - 16 років)
        if (data.age < 16) {
            throw new Error('Користувач повинен бути старше 16 років');
        }

        // Перевірка email на унікальність
        const existingUser = await UserModel.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('Користувач з таким email вже існує');
        }

        const user = await UserModel.create({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            age: data.age,
        });

        return user.toJSON() as UserEntity;
    }

    async getUserById(id: string): Promise<UserEntity | null> {
        const user = await UserModel.findByPk(id);
        return user ? (user.toJSON() as UserEntity) : null;
    }

    async getAllUsers(): Promise<UserEntity[]> {
        const users = await UserModel.findAll();
        return users.map(u => u.toJSON() as UserEntity);
    }

    async updateUserDebt(id: string, hasDebt: boolean): Promise<UserEntity | null> {
        const user = await UserModel.findByPk(id);
        if (!user) return null;

        user.has_debt = hasDebt;
        await user.save();
        return user.toJSON() as UserEntity;
    }
}
```

## 6 Створений API
![API](/assets/labs/lab-2/API.png)
**Рис. 4 - Створений API.**

---

---

## 6 Запуск застосунку

### 6.1 Початок роботи
```
cd backend
npx tsx index.ts
```

### 6.2 Створення міграцій
![Migrations](/assets/labs/lab-2/CreateTable.png)
**Рис. 5 - Створені міграції.**

### 6.3 Результат роботи
![StoreResult](/assets/labs/lab-2/StoreResult.png)
**Рис. 6 - Результат роботи.**

---

## 7 Висновки
Під час виконання цієї лабораторної роботи було створено базу даних і налагоджено зв'язок застосунку з нею за допомогою ORM Sequalize

---