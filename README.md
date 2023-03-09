Instant weather forecast using OpenWeather APIs (https://openweathermap.org/).

Since the free APIs provided by OpenWeather do not allow for city name search, but rather only GPS coordinates, I used two different APIs for this app. First, the city name provided by the user is sent as a parameter to the Geocoding API (https://openweathermap.org/current#geocoding), which then returns the GPS coordinates of said city. Then the coordinates are sent to the actual current weather data API (https://openweathermap.org/current), and the weather information is shown to the user on screen.

Live at https://weatherapi-3bii.onrender.com
