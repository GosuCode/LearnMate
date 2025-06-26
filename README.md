# LearnMate Frontend

An AI-powered e-learning platform designed to help students study smarter, not harder. The app allows users to input or upload academic content (notes, articles, or textbooks) and generates concise summaries, quizzes, and categorized learning materials using AI.

## Features

- **Smart Summarization**: Convert long academic texts into digestible bullet points or paragraphs
- **Quiz Generation**: Create objective-style or short-answer quizzes based on content
- **Categorization**: Automatically tag content by topic or subject for easy retrieval
- **User Authentication**: Secure login and registration system
- **Modern UI**: Clean and minimal interface built with ShadCN UI components

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS v4
- **UI Components**: ShadCN UI
- **Language**: TypeScript
- **State Management**: React hooks (useState, useEffect)
- **Backend**: Fastify (planned)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication Forms

The application includes two authentication forms:

### Login Form (`/auth/login`)

- Email and password fields
- Form validation
- Loading states
- Link to registration page

### Registration Form (`/auth/register`)

- Full name, email, password, and confirm password fields
- Comprehensive form validation including:
  - Required field validation
  - Email format validation
  - Password strength requirements (minimum 6 characters)
  - Password confirmation matching
- Real-time error clearing
- Loading states
- Link to login page

## Color Theme

LearnMate uses a modern blue-based color scheme:

- **Primary**: Blue (#3B82F6) - Used for buttons, links, and brand elements
- **Background**: Light blue gradient (#EFF6FF to #E0E7FF)
- **Text**: Dark gray (#111827) for headings, medium gray (#6B7280) for body text
- **Accents**: Green (#10B981) and Purple (#8B5CF6) for feature highlights

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── navigation.tsx
└── lib/
    └── utils.ts
```

## Next Steps

- [ ] Connect authentication forms to backend API
- [ ] Implement user session management
- [ ] Add content upload functionality
- [ ] Integrate AI summarization and quiz generation
- [ ] Add user dashboard
- [ ] Implement content categorization
- [ ] Add search and filtering capabilities

## Contributing

1. Follow the existing code style and patterns
2. Use clear commit messages following conventional commits
3. Test your changes thoroughly
4. Update documentation as needed

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
