const API_KEY = "6f9dc8c9e26544b87dc800ce1ac90eb6";

const form = document.querySelector(".find-location");
const cityInput = document.getElementById("city");

const todayCard = document.querySelector(".today");
const todayLocation = todayCard.querySelector(".location");
const todayTemp = todayCard.querySelector(".temp");
const todayIcon = todayCard.querySelector(".weather-icon");
const todayDate = todayCard.querySelector(".date");
const todayHumidity = document.getElementById("humidity");
const todayWind = document.getElementById("wind-speed");
const todayWindDeg = document.getElementById("wind-degree");

const forecastCards = Array.from(document.querySelectorAll(".forecast-container .forecast")).slice(1);
const ICON_BASE = "images/icons/";

function formatShortDate(d) {
    return d.getDate() + " " + d.toLocaleDateString(undefined, { month: "short" });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    const cur = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const curData = await cur.json();
    if (cur.status !== 200) return alert(curData.message);

    const forc = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const forData = await forc.json();
    if (forc.status !== 200) return alert(forData.message);

    todayLocation.textContent = curData.name;
    todayTemp.innerHTML = Math.round(curData.main.temp) + "<sup>o</sup>C";
    todayIcon.src = ICON_BASE + curData.weather[0].icon + ".svg";
    todayHumidity.textContent = curData.main.humidity + "%";
    todayWind.textContent = Math.round(curData.wind.speed * 3.6) + "km/h";
    todayWindDeg.innerHTML = curData.wind.deg + "<sup>o</sup>";
    todayDate.textContent = formatShortDate(new Date());

    const groups = {};
    for (let item of forData.list) {
        const d = item.dt_txt.split(" ")[0];
        if (!groups[d]) groups[d] = [];
        groups[d].push(item);
    }

    const todayISO = new Date().toISOString().split("T")[0];
    const futureDates = Object.keys(groups).filter(d => d !== todayISO).slice(0, 4);

    forecastCards.forEach((card, i) => {
        const dateKey = futureDates[i];
        if (!dateKey) return;

        const list = groups[dateKey];
        const best = list.reduce((a, b) =>
            Math.abs(new Date(a.dt_txt).getHours() - 12) <
            Math.abs(new Date(b.dt_txt).getHours() - 12) ? a : b
        );

        const d = new Date(best.dt_txt);
        card.querySelector(".day").textContent = d.toLocaleDateString(undefined, { weekday: "long" });

        let dateEl = card.querySelector(".date");
        if (!dateEl) {
            dateEl = document.createElement("div");
            dateEl.className = "date";
            card.querySelector(".forecast-header").appendChild(dateEl);
        }
        dateEl.textContent = formatShortDate(d);

        card.querySelector(".degree.temp").innerHTML = Math.round(best.main.temp) + "<sup>o</sup>C";
        card.querySelector(".weather-icon").src = ICON_BASE + best.weather[0].icon + ".svg";
    });
});



(function($, document, window) {

    $(document).ready(function() {

        // Cloning main navigation for mobile menu
        $(".mobile-navigation").append($(".main-navigation .menu").clone());

        // Mobile menu toggle 
        $(".menu-toggle").click(function() {
            $(".mobile-navigation").slideToggle();
        });
    });

    $(window).load(function() {

    });

})(jQuery, document, window);
