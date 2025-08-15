'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Thermometer, Wind, Droplets, Sun, Cloud, CloudRain, CloudSnow, Zap, Heart, Info, Trash2, Star, X, ExternalLink } from 'lucide-react';

export default function Home() {
  const [location, setLocation] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Load saved locations and API key from localStorage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedLocations') || '[]');
    setSavedLocations(saved);
    
    const savedApiKey = localStorage.getItem('openWeatherApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setShowApiInput(false);
    }
  }, []);

  // Save locations to localStorage whenever savedLocations changes
  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openWeatherApiKey', apiKey.trim());
      setShowApiInput(false);
    }
  };

  const getWeatherIcon = (weatherMain) => {
    const iconMap = {
      'Clear': <Sun className="w-8 h-8 text-yellow-500" />,
      'Clouds': <Cloud className="w-8 h-8 text-gray-500" />,
      'Rain': <CloudRain className="w-8 h-8 text-blue-500" />,
      'Drizzle': <CloudRain className="w-8 h-8 text-blue-400" />,
      'Snow': <CloudSnow className="w-8 h-8 text-blue-200" />,
      'Thunderstorm': <Zap className="w-8 h-8 text-purple-500" />,
      'Mist': <Cloud className="w-8 h-8 text-gray-400" />,
      'Fog': <Cloud className="w-8 h-8 text-gray-400" />,
    };
    return iconMap[weatherMain] || <Sun className="w-8 h-8 text-yellow-500" />;
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    if (!apiKey) {
      setError('Please enter your OpenWeatherMap API key first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const currentResponse = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      setCurrentWeather(currentData);
      
      // Process forecast data to get daily forecasts (one per day)
      const dailyForecast = [];
      const seenDates = new Set();
      
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!seenDates.has(date) && dailyForecast.length < 5) {
          dailyForecast.push(item);
          seenDates.add(date);
        }
      });
      
      setForecast({ list: dailyForecast });
      
    } catch (err) {
      setError('Failed to fetch weather data. Please check your API key and try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (searchLocation) => {
    if (!apiKey) {
      setError('Please enter your OpenWeatherMap API key first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const currentResponse = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(searchLocation)}&appid=${apiKey}&units=metric`
      );
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(searchLocation)}&appid=${apiKey}&units=metric`
      );

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Location not found or API error');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      setCurrentWeather(currentData);
      
      // Process forecast data to get daily forecasts
      const dailyForecast = [];
      const seenDates = new Set();
      
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!seenDates.has(date) && dailyForecast.length < 5) {
          dailyForecast.push(item);
          seenDates.add(date);
        }
      });
      
      setForecast({ list: dailyForecast });
      
    } catch (err) {
      setError('Failed to fetch weather data. Please check the location and try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (location.trim()) {
      fetchWeather(location.trim());
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          setError('Unable to retrieve your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const saveCurrentLocation = () => {
    if (currentWeather && !isLocationSaved(currentWeather.name)) {
      const locationData = {
        id: Date.now(),
        name: currentWeather.name,
        country: currentWeather.sys?.country || '',
        coords: currentWeather.coord
      };
      setSavedLocations(prev => [...prev, locationData]);
    }
  };

  const isLocationSaved = (locationName) => {
    return savedLocations.some(loc => loc.name.toLowerCase() === locationName.toLowerCase());
  };

  const removeSavedLocation = (locationId) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== locationId));
  };

  const loadSavedLocation = (savedLocation) => {
    if (savedLocation.coords) {
      fetchWeatherByCoords(savedLocation.coords.lat, savedLocation.coords.lon);
    } else {
      fetchWeather(savedLocation.name);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showApiInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Weather App Setup</h1>
          <p className="text-gray-600 mb-4 text-center">
            Enter your OpenWeatherMap API key to get started
          </p>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Get a free API key at <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">openweathermap.org</a>
          </p>
          
          <div className="space-y-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={saveApiKey}
              disabled={!apiKey.trim()}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save API Key & Continue
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            Your API key is stored locally in your browser
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Weather App</h1>
              <p className="text-sm opacity-90">by Faris Abdul Sukkur</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowInfoModal(true)}
                  className="p-2 shadow-sm hover:shadow-md bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                  title="About PM Accelerator"
                >
                  <Info className="w-5 h-5" />
                </button>
              <button
                onClick={() => setShowApiInput(true)}
                className="text-sm px-3 py-1 bg-opacity-10 rounded-lg hover:bg-opacity-30 transition-colors rounded-white shadow-sm hover:shadow-md"
              >
                Change API Key
              </button>
            </div>
            </div>
            
            {/* Search Form */}
            <div className="bg-white flex gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="Enter city, zip code, coordinates, or landmark..."
                  className="w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Current Location Button */}
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="w-full px-4 py-2 bg-opacity-20 text-white rounded-xl shadow-sm hover:shadow-md hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Use Current Location
            </button>
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-6">
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Fetching weather data...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              {/* Current Weather */}
              {currentWeather && (
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {currentWeather.name}
                          {currentWeather.sys?.country && (
                            <span className="text-gray-600">, {currentWeather.sys.country}</span>
                          )}
                        </h2>
                        <p className="text-gray-600 capitalize">
                          {currentWeather.weather[0].description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(currentWeather.weather[0].main)}
                        <button
                          onClick={saveCurrentLocation}
                          disabled={isLocationSaved(currentWeather.name)}
                          className={`p-2 rounded-xl transition-colors ${
                            isLocationSaved(currentWeather.name)
                              ? 'bg-green-100 text-green-600 cursor-not-allowed'
                              : 'bg-white text-gray-600 hover:bg-gray-100'
                          }`}
                          title={isLocationSaved(currentWeather.name) ? 'Location saved' : 'Save location'}
                        >
                          {isLocationSaved(currentWeather.name) ? <Star className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-xl p-4 text-center">
                        <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-800">{Math.round(currentWeather.main.temp)}°C</p>
                        <p className="text-sm text-gray-600">Temperature</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center">
                        <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-800">{Math.round(currentWeather.main.feels_like)}°C</p>
                        <p className="text-sm text-gray-600">Feels Like</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center">
                        <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-800">{currentWeather.main.humidity}%</p>
                        <p className="text-sm text-gray-600">Humidity</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center">
                        <Wind className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-800">{currentWeather.wind.speed} m/s</p>
                        <p className="text-sm text-gray-600">Wind Speed</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5-Day Forecast */}
              {forecast && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecast.list.map((day, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                        <p className="font-semibold text-gray-800 mb-2">
                          {index === 0 ? 'Today' : formatDate(day.dt)}
                        </p>
                        <div className="flex justify-center mb-2">
                          {getWeatherIcon(day.weather[0].main)}
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mb-1">
                          {Math.round(day.main.temp)}°C
                        </p>
                        <p className="text-sm text-gray-600 mb-2 capitalize">
                          {day.weather[0].main}
                        </p>
                        <p className="text-xs text-gray-500">
                          {day.main.humidity}% humidity
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Saved Locations */}
            <div className="w-80 bg-gray-50 p-6 border-l">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Saved Locations
              </h3>
              
              {savedLocations.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No saved locations yet. Search for a location and click the heart icon to save it.
                </p>
              ) : (
                <div className="space-y-2">
                  {savedLocations.map((savedLoc) => (
                    <div
                      key={savedLoc.id}
                      className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => loadSavedLocation(savedLoc)}
                        className="flex-1 text-left"
                      >
                        <p className="font-semibold text-gray-800">
                          {savedLoc.name}
                        </p>
                        {savedLoc.country && (
                          <p className="text-sm text-gray-500">{savedLoc.country}</p>
                        )}
                      </button>
                      <button
                        onClick={() => removeSavedLocation(savedLoc.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove location"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">About PM Accelerator Program</h2>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">About the Program</h3>
                <p className="text-gray-600 leading-relaxed">
                  The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. 
                  From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped 
                  over hundreds of students fulfill their career aspirations.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, 
                  honed and developed new PM and leadership skills, giving them a strong foundation for their future endeavors.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Services</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      🚀 PMA Pro
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      End-to-end product manager job hunting program that helps you master FAANG-level Product Management skills, 
                      conduct unlimited mock interviews, and gain job referrals through our largest alumni network. 25% of our offers 
                      came from tier 1 companies and get paid as high as $800K/year.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      🚀 AI PM Bootcamp
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Gain hands-on AI Product Management skills by building a real-life AI product with a team of AI Engineers, 
                      data scientists, and designers. We will also help you launch your product with real user engagement using our 
                      100,000+ PM community and social media channels.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      🚀 PMA Power Skills
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Designed for existing product managers to sharpen their product management skills, leadership skills, 
                      and executive presentation skills.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      🚀 PMA Leader
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      We help you accelerate your product management career, get promoted to Director and product executive levels, 
                      and win in the board room.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      🚀 1:1 Resume Review
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      We help you rewrite your killer product manager resume to stand out from the crowd, with an interview guarantee. 
                      Get started by using our FREE killer PM resume template used by over 14,000 product managers.
                    </p>
                    <a 
                      href="https://www.drnancyli.com/pmresume" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      Free Resume Template <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Free Resources</h3>
                <p className="text-gray-600 text-sm mb-3">
                  We also published over 500+ free training and courses. Start learning for free today:
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://www.youtube.com/c/drnancyli" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    📺 YouTube Channel <ExternalLink className="w-3 h-3" />
                  </a>
                  
                  <a 
                    href="https://www.instagram.com/drnancyli" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors text-sm"
                  >
                    📷 Instagram @drnancyli <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Check out our website to learn more about our services and start your PM journey today!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>



      
  );
}