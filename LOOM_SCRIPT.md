# Loom Demo Script (3-4 minutes)

This script will help you create a professional demo video for your submission.

## Introduction (30 seconds)

"Hi! I'm [Your Name], and I'm excited to walk you through my Flight Search Engine submission for the Frontend Developer position."

"I've built a responsive flight search application using React, TypeScript, and the Amadeus API. Let me show you the key features."

## Demo Flow (2.5 minutes)

### 1. Overview of the Interface (20 seconds)

"As you can see, the interface is clean and modern. I've designed it to be intuitive and user-friendly, moving away from typical flight search patterns while maintaining familiarity."

### 2. Search Functionality (40 seconds)

"Let me start by searching for a flight. I'll click on the 'From' field..."

**Actions:**
- Type "New York" → Show autocomplete
- Select JFK
- Type "Los Angeles" → Show autocomplete
- Select LAX
- Select tomorrow's date
- Change passengers to 2
- Click "Search Flights"

"Notice the airport autocomplete with real-time suggestions from the Amadeus API, showing city names and country codes."

### 3. Results & Price Graph (40 seconds)

"Here are our results! The page shows [X] flights found."

**Actions:**
- Scroll through 2-3 flight cards
- Point to the price graph

"This is the live price distribution graph built with Recharts. It shows how prices are distributed across all available flights. Watch what happens when I apply filters..."

### 4. Real-time Filtering (50 seconds)

**Actions:**
- Adjust price slider
- Notice graph updates immediately
- Select "Non-stop" filter
- Notice both results and graph update
- Select an airline
- Show how multiple filters work together
- Select "Morning" departure time

"As you can see, all filters work simultaneously and update both the flight list and the price graph in real-time. This was one of the key requirements, and I've implemented it so the user gets instant visual feedback."

### 5. Responsive Design (20 seconds)

**Actions:**
- Resize browser to mobile view
- Show mobile navigation
- Show search form on mobile
- Show filters on mobile
- Scroll through results

"The entire application is fully responsive. On mobile, the layout adapts while maintaining all functionality."

### 6. Additional Features (10 seconds)

"I've also added clear filter indicators, loading states, error handling, and empty state designs to enhance the user experience."

## Technical Explanation (40 seconds)

### Architecture Decisions

"From a technical perspective, I made several key decisions:"

"**TypeScript** throughout for type safety and better developer experience."

"**Component Architecture**: I separated concerns into SearchForm, FlightCard, PriceGraph, and FilterPanel components, making the code modular and maintainable."

"**API Integration**: I implemented token caching for the Amadeus OAuth flow, debounced airport searches to reduce API calls, and proper error handling throughout."

"**State Management**: I used React hooks to manage application state, with useEffect for filter synchronization ensuring the graph and results always stay in sync."

"**Performance**: The filtering happens client-side after the initial fetch, making interactions instant. Airport searches are debounced to prevent excessive API calls."

## Conclusion (20 seconds)

"This project demonstrates my ability to build production-ready applications with modern React patterns, TypeScript, responsive design, and third-party API integration."

"All the code is available on GitHub, and the application is deployed and ready to use. Thank you for considering my submission!"

---

## Recording Tips

1. **Preparation:**
   - Have the app running locally
   - Clear browser cache
   - Close unnecessary tabs
   - Test your microphone
   - Prepare example searches in advance

2. **During Recording:**
   - Speak clearly and confidently
   - Move mouse slowly when pointing
   - Don't rush through features
   - If you make a mistake, pause and continue (you can edit)
   - Show genuine enthusiasm

3. **Technical Setup:**
   - Use 1920x1080 resolution
   - Record browser window + audio
   - Test recording first (practice run)
   - Keep it under 4 minutes

4. **What to Avoid:**
   - Don't apologize for anything
   - Don't mention what you didn't build
   - Don't spend too much time on one feature
   - Don't read code line by line
   - Don't go over 4 minutes

## Alternative Shorter Script (If needed)

If you need to condense:

1. **Introduction** (15s): Name and quick overview
2. **Search Demo** (30s): Quick search with autocomplete
3. **Results & Filters** (60s): Show results, demonstrate 2-3 filters, highlight real-time graph updates
4. **Responsive Design** (20s): Quick mobile demo
5. **Technical Overview** (45s): Architecture, key decisions, technologies
6. **Conclusion** (10s): Thank you and next steps

Total: 3 minutes
