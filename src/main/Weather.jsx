import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import "./weather.css";
// FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureThreeQuarters } from "@fortawesome/free-solid-svg-icons";
import { faWater } from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faWind } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
// mui: toggle buttons for language
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// translate package
import { useTranslation } from "react-i18next";
// --------------------------------------------------------------------
export default function Weather() {
  const [weatherData, setWeatherData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cityName, setCityName] = useState("");
  const apiKey = import.meta.env.VITE_API_KEY;
  const getWeather = async () => {
    if (!cityName) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
      );
      setWeatherData(response.data);
      setError("");
      setCityName("");
      console.log(response.data);
    } catch (error) {
      setError(t("Sorry, the city name is not available."));
    } finally {
      setLoading(false);
    }
  };
  // language state
  const { t, i18n } = useTranslation();
  const [lang, setLang] = React.useState("ar");
  const handleLang = (event, newLang) => {
    if (newLang !== null) {
      setLang(newLang);
    }
  };
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  // direction
  let direction = lang === "ar" ? "rtl" : "ltr";
  return (
    <>
      {/* start language option */}
      <ToggleButtonGroup
        value={lang}
        exclusive
        onChange={handleLang}
        style={{ backgroundColor: "#0374a6" }}
        dir={direction}
      >
        <ToggleButton
          value="ar"
          style={{
            backgroundColor: lang === "ar" ? "#03a9f4" : "transparent",
            color: "white",
          }}
        >
          {t("Arabic")}
        </ToggleButton>
        <ToggleButton
          value="en"
          style={{
            backgroundColor: lang === "en" ? "#03a9f4" : "transparent",
            color: "white",
          }}
        >
          {t("English")}
        </ToggleButton>
      </ToggleButtonGroup>
      {/* End language option */}
      <div className="weather">
        <h1>{t("Weather app")}</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (cityName) {
              getWeather();
            }
          }}
          dir={direction}
        >
          <input
            type="text"
            placeholder={t("enter a city name")}
            value={cityName}
            onChange={(e) => {
              setCityName(() => e.target.value);
            }}
            required
            dir={direction}
          />
          <Button
            variant="contained"
            endIcon={<SearchIcon />}
            onClick={(e) => {
              e.preventDefault();
              getWeather();
            }}
            disabled={cityName == ""}
            dir="ltr"
          >
            {t("search")}
          </Button>
        </form>
        {loading ? (
          <Loading />
        ) : error ? (
          <h2 className="error">{error}</h2>
        ) : weatherData ? (
          <div className="weather-data">
            <h1 className="city-name">
              {weatherData.name}
              <span>({weatherData.sys.country})</span>
            </h1>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <h2 className="desc">
              <span>{t(weatherData.weather[0].description)}</span>
            </h2>
            <p dir={direction}>
              <FontAwesomeIcon
                icon={faTemperatureThreeQuarters}
                className="icon"
              />
              {t("feels like")}: <span>{weatherData.main.feels_like}</span>°C
            </p>

            <p dir={direction}>
              <FontAwesomeIcon icon={faDroplet} className="icon" />
              {t("humidity")}: <span>{weatherData.main.humidity}</span>%
            </p>
            <p dir={direction}>
              <FontAwesomeIcon icon={faClock} className="icon" />
              {t("pressure")}: <span>{weatherData.main.pressure}</span>hPa
            </p>
            <p dir={direction}>
              <FontAwesomeIcon icon={faWater} className="icon" />
              {t("sea level")}: <span>{weatherData.main.sea_level}</span>hPa
            </p>
            <p dir={direction}>
              <FontAwesomeIcon
                icon={faTemperatureThreeQuarters}
                className="icon"
              />
              {t("temperature")}: <span>{weatherData.main.temp}</span>°C
            </p>
            <p dir={direction}>
              <FontAwesomeIcon
                icon={faTemperatureThreeQuarters}
                className="icon"
              />
              {t("mininum temperature")}:{" "}
              <span>{weatherData.main.temp_min}</span>°C
            </p>
            <p dir={direction}>
              <FontAwesomeIcon
                icon={faTemperatureThreeQuarters}
                className="icon"
              />
              {t("maximum temperature")}:{" "}
              <span>{weatherData.main.temp_max}</span>°C
            </p>
            <p dir={direction}>
              <FontAwesomeIcon icon={faWind} className="icon" />
              {t("wind speed")}: <span>{weatherData.wind.speed}</span>m/s
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
