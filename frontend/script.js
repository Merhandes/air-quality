let grafikSensor = null;
let petaSensor = null;
let markers = [];

// default center
const defaultLat = -6.229742;
const defaultLng = 106.652134;

// =====================================================
// INIT MAP
// =====================================================
function initMap() {
  if (petaSensor) return;

  petaSensor = L.map("map").setView([defaultLat, defaultLng], 12);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(petaSensor);
}

// =====================================================
// UTIL: UNIQUE LOCATION
// =====================================================
function getUniqueLocationData(data) {
  const map = {};

  data.forEach((item) => {
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;

    // ambil data pertama (diasumsikan sudah terbaru)
    if (!map[key]) {
      map[key] = item;
    }
  });

  return Object.values(map);
}

// =====================================================
// UPDATE MAP
// =====================================================
function updatePeta(dataLokasi) {
  initMap();

  // hapus marker lama
  markers.forEach((m) => petaSensor.removeLayer(m));
  markers = [];

  const bounds = [];

  dataLokasi.forEach((item) => {
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    const marker = L.marker([lat, lng]).addTo(petaSensor).bindPopup(`
        <b>Monitoring Udara</b><br>
        PM2.5 : ${item.pm2_5 ?? 0} µg/m³<br>
        Temp : ${item.temperature ?? 0} °C<br>
        Hum : ${item.humidity ?? 0} %<br>
        CO2 : ${item.co2 ?? 0} ppm
      `);

    markers.push(marker);
    bounds.push([lat, lng]);
  });

  if (bounds.length > 0) {
    petaSensor.fitBounds(bounds, {
      padding: [50, 50],
    });
  }
}

// =====================================================
// DASHBOARD RENDER
// =====================================================
async function renderDashboard() {
  try {
    const respon = await fetch("/api/sensor");
    const hasil = await respon.json();

    const rawData = hasil.data;

    console.log("DATA RAW:", rawData);

    if (!hasil.success || !rawData || rawData.length === 0) {
      document.getElementById("tabel-sensor-body").innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-danger py-4">
            Tidak ada data
          </td>
        </tr>
      `;
      return;
    }

    // =================================================
    // 1. DASHBOARD (20 TERBARU)
    // =================================================
    const dashboardData = rawData.slice(0, 20);

    // =================================================
    // 2. MAP (UNIQUE LOCATION)
    // =================================================
    const mapData = getUniqueLocationData(rawData);

    updatePeta(mapData);

    // =================================================
    // TABLE
    // =================================================
    const tabelBody = document.getElementById("tabel-sensor-body");
    tabelBody.innerHTML = "";

    dashboardData.forEach((item) => {
      const waktu = new Date(item.timestamp).toLocaleString("id-ID");

      const row = document.createElement("tr");

      row.innerHTML = `
        <td><strong>${waktu}</strong></td>
        <td>
          <div class="d-flex flex-wrap gap-2">
            <span class="badge bg-primary p-2">
              PM2.5: ${item.pm2_5 ?? 0}
            </span>
            <span class="badge bg-success p-2">
              Temp: ${item.temperature ?? 0}
            </span>
            <span class="badge bg-info text-dark p-2">
              Hum: ${item.humidity ?? 0}
            </span>
            <span class="badge bg-warning text-dark p-2">
              CO2: ${item.co2 ?? 0}
            </span>
          </div>
        </td>
        <td>
          <span class="badge bg-light text-success border border-success fw-bold">
            Active
          </span>
        </td>
      `;

      tabelBody.appendChild(row);
    });

    // =================================================
    // CHART
    // =================================================
    const chartData = [...dashboardData].reverse();

    const labels = chartData.map((item) =>
      new Date(item.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );

    const pm25 = chartData.map((item) => item.pm2_5 ?? 0);

    updateGrafik(labels, pm25);
  } catch (err) {
    console.error("Render dashboard gagal:", err);
  }
}

// =====================================================
// CHART UPDATE
// =====================================================
function updateGrafik(labels, data) {
  const ctx = document.getElementById("sensorChart").getContext("2d");

  if (grafikSensor) {
    grafikSensor.data.labels = labels;
    grafikSensor.data.datasets[0].data = data;
    grafikSensor.update();
  } else {
    grafikSensor = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "PM2.5 (µg/m³)",
            data: data,
            borderColor: "#007BFF",
            backgroundColor: "rgba(0,123,255,0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

// =====================================================
// START AUTO REFRESH
// =====================================================
renderDashboard();
setInterval(renderDashboard, 5000);
