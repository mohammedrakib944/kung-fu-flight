# Flight Search Engine

A modern, responsive flight search engine built with React, TypeScript, and Tailwind CSS, powered by the Amadeus Self-Service API.

## Features

✅ **Search & Results**: Comprehensive search interface with origin, destination, dates, and passenger selection
✅ **Live Price Graph**: Real-time price distribution chart that updates as filters are applied
✅ **Complex Filtering**: Multiple simultaneous filters including:

- Maximum price slider
- Airline selection
- Number of stops (non-stop, 1 stop, 2+ stops)
- Departure time (morning, afternoon, evening, night)
  ✅ **Responsive Design**: Fully functional on mobile, tablet, and desktop
  ✅ **Modern UI/UX**: Clean, intuitive interface with smooth interactions
  ✅ **Real-time Updates**: Instant filter application with live graph updates

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Amadeus API** - Flight data
- **date-fns** - Date formatting
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd flight-search-engine
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

This app can be deployed to any static hosting service:

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## Key Features Explained

### 1. Smart Airport Search

- Real-time airport/city autocomplete
- Debounced API calls for performance
- Displays airport codes, city names, and countries

### 2. Dynamic Price Graph

- Shows price distribution across all results
- Updates instantly when filters are applied
- Built with Recharts for smooth animations

### 3. Advanced Filtering System

- **Price**: Slider to set maximum price
- **Airlines**: Multi-select airline filtering
- **Stops**: Filter by number of stops
- **Departure Time**: Filter by time of day
- All filters work simultaneously and update in real-time

### 4. Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly controls

## API Integration

This project uses the Amadeus Self-Service Test API:

**Authentication**: OAuth 2.0 Client Credentials flow
**Endpoints Used**:

- `/v1/security/oauth2/token` - Authentication
- `/v1/reference-data/locations` - Airport search
- `/v1/shopping/flight-offers` - Flight search

The API credentials are configured in `src/services/amadeusApi.ts`.

## Design Decisions

### Why These Technologies?

1. **React + TypeScript**: Type safety and component reusability
2. **Vite**: Fast development and build times
3. **Tailwind CSS**: Rapid UI development with utility classes
4. **Recharts**: Simple, responsive charts with good TypeScript support

### Architecture Highlights

- **Separation of Concerns**: Clear division between UI, API, and business logic
- **Type Safety**: Comprehensive TypeScript types for all data structures
- **Performance**: Debounced searches, efficient filtering, memoization opportunities
- **User Experience**: Loading states, error handling, empty states

### Filter Implementation

The filtering system is designed to be:

- **Real-time**: Instant feedback as users adjust filters
- **Combinatorial**: Multiple filters work together seamlessly
- **Reversible**: Easy to clear individual or all filters
- **Visual**: Clear indication of active filters

## Performance Optimizations

1. **API Token Caching**: Tokens are cached and reused until expiry
2. **Debounced Search**: Airport searches are debounced to reduce API calls
3. **Efficient Filtering**: Client-side filtering after initial data fetch
4. **Lazy Evaluation**: Components only re-render when necessary

## Future Enhancements

Potential improvements for production:

- User authentication and saved searches
- Flight comparison feature
- Price alerts and tracking
- Multi-city search support
- Booking integration
- More detailed flight information (baggage, amenities)
- Historical price trends
- Carbon footprint calculator

## Testing

To test the application:

1. **Search for flights**: Try various routes (e.g., NYC to LAX, LON to PAR)
2. **Apply filters**: Test each filter individually and in combination
3. **Check responsiveness**: Resize browser or test on mobile
4. **Verify graph updates**: Ensure the price graph updates with filters
5. **Test edge cases**: No results, network errors, invalid inputs

## Troubleshooting

### API Issues

- Ensure you're using test environment endpoints
- Check API quota limits
- Verify credentials are correct

### Build Issues

- Delete `node_modules` and reinstall
- Clear Vite cache: `rm -rf node_modules/.vite`
- Ensure Node version is 16+

## License

MIT

## Author

Built as a technical assessment demonstrating modern web development practices.
