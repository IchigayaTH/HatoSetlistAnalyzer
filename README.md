# HatoBito Setlist Analyzer

A Next.js-based web application for managing and analyzing setlists of HatoBito, a Thai underground idol group. This application tracks setlist performances, member participation, and provides statistical insights and predictions for future events.

## Features

### 1. Event Management (Events Tab)
- Register events with date, name, venue, and participating members
- Edit and delete event information
- View all events in a grid layout

### 2. Setlist Management (Setlist Tab)
- Create and manage setlists for each event
- Add songs to setlist with member selections
- Edit and delete setlist records
- View all setlist history

### 3. Dashboard (Dashboard Tab)
- View song adoption rates (how frequently each song is performed)
- Analyze member participation rates
- Display statistics: total setlists, songs, members
- Visual progress bars for adoption and participation metrics

### 4. Setlist Prediction (Prediction Tab)
- Predict upcoming setlist based on:
  - Event's participating members
  - Song's default select members
  - Past adoption rates
- Display top 4 predicted songs with prediction scores
- Filter by member availability (60%+)

### 5. Master Data Management (Masters Tab)
- **Members**: Manage member information (name, birth date, join date, status)
- **Songs**: Manage song catalog (title, duration, release date)
- Add, edit, delete members and songs

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout with DataProvider
│   ├── page.tsx           # Main page with tab navigation
│   └── globals.css        # Global styles and Tailwind config
├── components/
│   ├── DataProvider.tsx   # Global data context
│   ├── TabNavigation.tsx  # Tab navigation component
│   └── tabs/
│       ├── EventsTab.tsx
│       ├── SetlistTab.tsx
│       ├── DashboardTab.tsx
│       ├── PredictionTab.tsx
│       └── MastersTab.tsx
├── types/
│   └── index.ts           # TypeScript type definitions
└── data/
    └── dummyData.ts       # Sample data (16 members, 8 songs, 5 events, 5 setlists)
```

## Data Models

### Member
- id, name (EN), nameJa (Japanese)
- birthDate, joinDate
- status (active/inactive/hiatus)

### Song
- id, title (EN), titleJa (Japanese)
- duration (seconds), releaseDate
- defaultSelectMembers (array of member IDs)

### Event
- id, date, name, venue
- participatingMembers (array of member IDs)

### Setlist
- id, eventId
- songs (array of SetlistSong with selected members)
- createdAt, updatedAt

## Technology Stack

- **Framework**: Next.js 16.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom pink/red theme
- **State Management**: React Context API
- **Responsive Design**: Mobile-first approach

## Design Features

- **Color Scheme**: Pink and red theme based on HatoBito branding
- **Responsive Layout**:
  - PC: Left sidebar navigation (gray)
  - Mobile: Bottom tab navigation bar
- **Custom CSS Classes**: `.hato-btn-primary`, `.hato-card`, `.hato-header`

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Sample Data

The application comes pre-loaded with:
- **16 Members**: Thai idol group members with various join dates
- **8 Songs**: Song catalog with titles and durations
- **5 Events**: Past events with dates and venues
- **5 Setlists**: Historical performance records

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Image upload for members and songs
- Advanced filtering and search
- Export setlists to CSV/PDF
- Analytics charts (Chart.js/Recharts)
- Member availability calendar
- Notification system for events

## Deployment

This application is optimized for Vercel deployment:

```bash
npm run build
```

## License

MIT


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
