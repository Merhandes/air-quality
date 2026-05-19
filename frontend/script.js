let grafikSensor = null;

// Fungsi Utama: Mengambil data dari backend dan menampilkannya ke UI
async function renderDashboard() {
  try {
    const respon = await fetch("/api/sensor");
    const hasil = await respon.json();

    // Jika API gagal atau data kosong, hentikan proses
    if (!hasil.success || !hasil.data || hasil.data.length === 0) {
      document.getElementById("tabel-sensor-body").innerHTML = `
        <tr><td colspan="3" class="text-center text-danger py-4">Tidak ada data ditemukan di database.</td></tr>
      `;
      return;
    }

    // 1. ISI DATA KE TABEL HTML
    const tabelBody = document.getElementById("tabel-sensor-body");
    tabelBody.innerHTML = ""; // Bersihkan teks "Memuat data..."

    hasil.data.forEach((item) => {
      const baris = document.createElement("tr");

      // Ambil waktu lokal Indonesia
      const waktuLokal = new Date(item.timestamp).toLocaleString("id-ID");

      baris.innerHTML = `
        <td><strong>${waktuLokal}</strong></td>
        <td>
          <div class="d-flex flex-wrap gap-2">
            <span class="badge bg-primary p-2">PM2.5: ${
              item.pm2_5 ?? 0
            } µg/m³</span>
            <span class="badge bg-success p-2">Temp: ${
              item.temperature ?? 0
            } °C</span>
            <span class="badge bg-info text-dark p-2">Hum: ${
              item.humidity ?? 0
            } %</span>
            <span class="badge bg-warning text-dark p-2">CO2: ${
              item.co2 ?? 0
            } ppm</span>
          </div>
        </td>
        <td><span class="badge bg-light text-success border border-success fw-bold">Active</span></td>
      `;
      tabelBody.appendChild(baris);
    });

    // 2. UPDATE GRAFIK VISUAL (CHART.JS)
    // Balik urutan data khusus untuk grafik agar berjalan dari Kiri (Lama) ke Kanan (Baru)
    const dataTerbalik = [...hasil.data].reverse();

    const labelWaktu = dataTerbalik.map((item) =>
      new Date(item.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
    const dataPM25 = dataTerbalik.map((item) => item.pm2_5 ?? 0);

    updateGrafik(labelWaktu, dataPM25);
  } catch (error) {
    console.error("❌ Gagal merender dashboard:", error);
    document.getElementById("tabel-sensor-body").innerHTML = `
      <tr><td colspan="3" class="text-center text-danger py-4">Gagal terhubung ke server API backend.</td></tr>
    `;
  }
}

// Fungsi Pembantu: Menggambar & memperbarui diagram garis Chart.js
function updateGrafik(labels, dataPoin) {
  const ctx = document.getElementById("sensorChart").getContext("2d");

  if (grafikSensor) {
    // Jika grafik sudah terbentuk sebelumnya, tinggal perbarui datanya saja
    grafikSensor.data.labels = labels;
    grafikSensor.data.datasets[0].data = dataPoin;
    grafikSensor.update();
  } else {
    // Membuat objek grafik baru saat halaman pertama kali dimuat
    grafikSensor = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Tingkat Polusi PM 2.5 (µg/m³)",
            data: dataPoin,
            borderColor: "#007BFF",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
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
          y: { beginAtZero: true },
        },
      },
    });
  }
}

// Jalankan fungsi saat browser pertama kali dibuka
renderDashboard();

// Otomatis refresh data di tabel dan grafik setiap 5 detik tanpa reload halaman
setInterval(renderDashboard, 5000);
