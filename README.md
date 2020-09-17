# Admin-Panel-using-MERN-Stack
A simple admin panel with MERN Stack(M - MySQL) to perform basic CRUD operations.

## Installation
Clone the repository and use npm to install dependencies in both backend and frontend directories seperately.
```bash
npm install
```

## Backend
Open terminal in backend directory and run the node/express server using the following command.
```bash
npm run server
```

## Frontend
Open terminal in frontend directory and run the React frontend using the following command.
```bash
npm start
```

The frontend is served on [localhost:3000](http://localhost:3000/)

## Database
Create a database named og_ngo.

### Creating events table
```SQL
CREATE TABLE `events` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `details` varchar(500) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Creating users table
```SQL
CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `number` varchar(16) NOT NULL,
  `eventid` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Adding foreign key constraint for event id
```SQL
ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`eventid`) REFERENCES `events` (`id`);
```
