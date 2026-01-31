# EverHack - Cinematic Event Platform

Welcome to the EverHack project! This is a cinematic, high-performance event management platform built for hackathons, CTFs, and workshops.

## Project Stack

- **Frontend**: React + Vite + TypeScript
- **UI Framework**: Shadcn/UI + Tailwind CSS
- **Animations**: Framer Motion
- **Backend (Mock)**: LocalStorage-based service simulation (No external DB required)

## Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository**:
    ```sh
    git clone <YOUR_GIT_URL>
    ```

2.  **Install dependencies**:
    ```sh
    npm install
    ```

3.  **Run the development server**:
    ```sh
    npm run dev
    ```
    Open [http://localhost:8080](http://localhost:8080) in your browser.

## Features

- **Event Management**: Create, Edit, Delete, and End events.
- **Team Finder**: Create teams with member limits (max 4). Join/Leave teams.
- **User Dashboard**: Track registrations, view statuses, and cancel participation.
- **Admin Dashboard**: Comprehensive control over users and events with analytics.
- **Leaderboard**: Global ranking system based on user points.

## Deployment

To deploy this project, you can use any static hosting service like Vercel or Netlify.
Build the project using:
```sh
npm run build
```
Then deploy the `dist` folder.
