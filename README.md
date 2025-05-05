# Classify - Enhanced Craigslist Clone

Classify is a modern, feature-rich classifieds platform inspired by Craigslist but enhanced with AI-powered features and a sleek user interface.

## Features

- **AI-Powered Ad Creation**: Generate professional ad descriptions with Gemini AI
- **Smart Chatbot Assistant**: Get help with buying, selling, and navigating the platform
- **User Authentication**: Secure account management with Supabase
- **Post Management**: Create, edit, and manage classified ads
- **Search & Filtering**: Find exactly what you're looking for with advanced filtering
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Modern UI**: Clean, intuitive interface for a great user experience

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Shadcn/UI components
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript for type safety
- Supabase for authentication and database
- Google Gemini AI for content generation and chatbot

### Infrastructure
- Supabase for managed PostgreSQL database
- Supabase Storage for image hosting

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account (for database and auth)
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/classify.git
   cd classify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root directory:
   ```
   # Supabase Configuration
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-role-key

   # Google Gemini API
   GEMINI_API_KEY=your-gemini-api-key

   # Server Configuration
   PORT=3001
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   # Run frontend only
   npm run dev
   
   # Run backend only
   npm run server
   
   # Run both concurrently
   npm run dev:all
   ```

5. Open your browser and navigate to `http://localhost:5173` to see the app.

### Database Setup

The project includes Supabase migration files that define the database schema. To set up your database:

1. Install Supabase CLI
2. Link your project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
3. Apply migrations:
   ```bash
   supabase db push
   ```

## Project Structure

```
classify/
├── public/            # Public assets
├── server/            # Backend server code
│   ├── config/        # Server configuration
│   ├── controllers/   # API controllers
│   ├── middleware/    # Express middleware
│   ├── models/        # Data models and types
│   ├── routes/        # API routes
│   ├── services/      # External service integrations
│   └── index.ts       # Server entry point
├── src/               # Frontend code
│   ├── components/    # React components
│   ├── data/          # Mock data for development
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and services
│   ├── pages/         # Page components
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Frontend entry point
├── supabase/          # Supabase migrations and types
├── uploads/           # Local file uploads (dev only)
├── .env               # Environment variables (not in git)
└── package.json       # Project dependencies and scripts
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in existing user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile

### Listings

- `GET /api/listings` - Get all listings with optional filters
- `GET /api/listings/:id` - Get single listing by ID
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update existing listing
- `DELETE /api/listings/:id` - Delete listing
- `GET /api/listings/featured` - Get featured listings
- `GET /api/listings/user/:userId` - Get listings by user
- `POST /api/listings/generate-content` - Generate ad content with AI

### Chatbot

- `POST /api/chatbot/conversations` - Create new conversation
- `GET /api/chatbot/conversations` - Get user conversations
- `GET /api/chatbot/conversations/:conversationId/messages` - Get conversation messages
- `POST /api/chatbot/messages` - Send message to chatbot
- `DELETE /api/chatbot/conversations/:conversationId` - Delete conversation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by Craigslist
- Powered by Supabase and Google Gemini AI
- UI components from Shadcn/UI
