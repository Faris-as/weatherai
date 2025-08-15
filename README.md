# 🌤️ Weather App

A modern, responsive weather application built with **Next.js**, **React**, and **Tailwind CSS**. Get real-time weather data, 5-day forecasts, and manage your favorite locations with a beautiful, intuitive interface.

**Built by:** Faris Abdul Sukkur

![Weather App Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-13+-black) ![React](https://img.shields.io/badge/React-18+-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🚀 Features

### Core Weather Functionality
- **🌍 Multiple Location Input Types**: City names, ZIP codes, postal codes, GPS coordinates, landmarks
- **📍 Geolocation Support**: Auto-detect current location with one click  
- **🌡️ Current Weather**: Temperature, feels-like, humidity, wind speed, weather conditions
- **📅 5-Day Forecast**: Extended weather predictions with daily breakdowns
- **🎨 Weather Icons**: Visual weather representations using Lucide React icons

### Advanced Features  
- **⭐ Save Favorite Locations**: Bookmark frequently checked locations
- **🗑️ Manage Saved Locations**: Easy add/remove functionality with persistent storage
- **🔐 Secure API Key Management**: Local storage with setup wizard
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Data**: Live weather updates from OpenWeatherMap API
- **🎭 Beautiful UI**: Modern gradient design with smooth animations

### Developer Features
- **🛡️ Error Handling**: Comprehensive error states and user feedback
- **⏳ Loading States**: Smooth loading animations and indicators
- **💾 Local Persistence**: Settings and favorites saved locally
- **🔄 State Management**: Clean React hooks implementation

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: JavaScript/TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [OpenWeatherMap API](https://openweathermap.org/api)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser localStorage

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/weather-app.git
cd weather-app

# Install dependencies
npm install
npm install lucide-react

# Start development server
npm run dev
```

### Get API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Create a free account
3. Generate an API key from your dashboard
4. Enter the API key when prompted in the app

### Project Structure
```
weather-app/
├── src/
│   └── app/
│       ├── page.js          # Main weather component
│       ├── layout.js        # Root layout
│       └── globals.css      # Global styles with Tailwind
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── README.md              # This file
```

## 🎯 Usage

### Basic Weather Search
1. **Text Search**: Enter any city, ZIP code, coordinates, or landmark
2. **Current Location**: Click "Use Current Location" for GPS-based weather
3. **View Details**: See current conditions and 5-day forecast

### Managing Locations
1. **Save Location**: Click the ❤️ heart icon next to any weather result
2. **Quick Access**: Use the saved locations sidebar for instant weather
3. **Remove Location**: Click the 🗑️ trash icon to remove saved locations

### API Key Management
1. **Initial Setup**: Enter your API key on first launch
2. **Change Key**: Click "Change API Key" in the header anytime
3. **Secure Storage**: Keys are stored locally in your browser

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env.local` file for default API key:
```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### Tailwind Customization
Modify `tailwind.config.js` to customize the design system:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add custom colors
      },
    },
  },
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📱 Screenshots

### Main Interface
- Clean, modern design with gradient backgrounds
- Intuitive search with multiple input types
- Real-time weather display with visual icons

### Saved Locations
- Sidebar panel for quick location access
- Persistent favorites with local storage
- Easy management with add/remove functionality

### Mobile Responsive
- Optimized layouts for all screen sizes
- Touch-friendly interface elements
- Consistent experience across devices

## 🏗️ Architecture

### Component Structure
```
WeatherApp (Main Component)
├── API Key Setup Modal
├── Header Section
│   ├── Search Input
│   ├── Current Location Button
│   └── Info Modal
├── Main Content
│   ├── Current Weather Display
│   └── 5-Day Forecast Grid
└── Saved Locations Sidebar
```

### Data Flow
1. **User Input** → Search/GPS request
2. **API Call** → OpenWeatherMap API
3. **Data Processing** → Format weather data
4. **UI Update** → Display results
5. **Local Storage** → Save preferences

## 🧪 Testing

### Manual Testing Checklist
- [ ] Search by city name
- [ ] Search by ZIP code
- [ ] Search by coordinates
- [ ] Use current location
- [ ] Save/remove locations
- [ ] API key management
- [ ] Responsive design
- [ ] Error handling

### API Testing
```bash
# Test API connection
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing comprehensive weather API
- **Lucide** for beautiful, consistent icons
- **Tailwind CSS** for utility-first styling
- **Next.js** team for the excellent React framework
- **PM Accelerator Program** for career development resources

## 📞 Contact & Support

**Developer**: Faris Abdul Sukkur

For questions about the PM Accelerator Program, check out the info modal in the app or visit:
- **YouTube**: [Dr. Nancy Li](https://www.youtube.com/c/drnancyli)
- **Instagram**: [@drnancyli](https://www.instagram.com/drnancyli)
- **Free Resume Template**: [PM Resume Guide](https://www.drnancyli.com/pmresume)

---

⭐ **If you found this project helpful, please give it a star!** ⭐