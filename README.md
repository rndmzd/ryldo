# Ryldo

A modern full-stack e-commerce application built with React and Node.js, featuring user authentication, product management, and admin capabilities.

## Features

- 🔐 User Authentication & Authorization
- 🛍️ Product Browsing & Management
- 👤 User Profile Management
- 📦 Shopping Cart Functionality
- 🏠 Address Management
- 👑 Admin Dashboard
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure JWT-based Authentication

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Radix UI Components
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Winston for logging

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ryldo.git
   cd ryldo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001
```

## Project Structure

```
ryldo/
├── public/           # Static files
├── server/           # Backend server code
│   ├── models/       # MongoDB models
│   ├── middleware/   # Express middleware
│   └── index.js      # Server entry point
├── src/             # Frontend source code
│   ├── components/  # React components
│   ├── context/     # React context providers
│   ├── utils/       # Utility functions
│   └── App.js       # Main App component
└── package.json     # Project dependencies
```

## Available Scripts

- `npm start` - Starts the development server
- `npm build` - Creates a production build
- `npm test` - Runs the test suite
- `npm eject` - Ejects from create-react-app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ by the Ryldo team
