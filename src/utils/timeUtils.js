import moment from "moment-timezone";

// Fungsi untuk mendapatkan waktu saat ini di timezone Jakarta
function getCurrentTime() {
  return moment().tz("Asia/Jakarta").toDate();
}

function formattedDate(date, format) {
  return moment(date).tz("Asia/Jakarta").format(format);
}

function getDuration(startTime, endTime) {
  // Mengonversi string ke objek waktu dengan timezone Jakarta
  const start = moment.tz(startTime, "HH:mm", "Asia/Jakarta");
  const end = moment.tz(endTime, "HH:mm", "Asia/Jakarta");

  // Menghitung durasi dalam menit
  const duration = moment.duration(end.diff(start));

  // Mengembalikan durasi dalam format jam
  const hours = Math.floor(duration.asHours());

  return hours;
}

function getDayDuration(startdate, enddate) {
  // Mengonversi string ke objek waktu dengan timezone Jakarta
  const start = moment.tz(startdate, "DD-MM-YYYY", "Asia/Jakarta");
  const end = moment.tz(enddate, "DD-MM-YYYY", "Asia/Jakarta");

  // Menghitung durasi dalam Hari
  const duration = moment.duration(end.diff(start));

  // Mengembalikan durasi dalam format Hari
  const days = duration.asDays();

  return Math.floor(days);
}


function getDurationMinute(startTime, endTime) {
  // Mengonversi string ke objek waktu dengan timezone Jakarta
  const start = moment.tz(startTime, "HH:mm", "Asia/Jakarta");
  const end = moment.tz(endTime, "HH:mm", "Asia/Jakarta");

  // Menghitung durasi dalam menit
  const duration = moment.duration(end.diff(start));

  // Mengembalikan durasi dalam format jam
  const hours = Math.floor(duration.asMinutes());

  return hours;
}

function getEndDate(start_date, days) {
  const endDate = moment.tz(start_date, "YYYY-MM-DD HH:mm", "Asia/Jakarta");

  // Menambahkan durasi Hari ke end date
  endDate.add(days, "days");
  return endDate;
}

function getEndTime(startTime, duration) {
  // Mengonversi startTime ke objek waktu dengan timezone Jakarta
  const start = moment.tz(startTime, "HH:mm", "Asia/Jakarta");

  // Menambahkan durasi (jam) ke start time
  start.add(duration, "hours");

  // Mengembalikan end_time dalam format 'HH:mm'
  return start.format("HH:mm");
}
function plusTime(startTime, duration) {
  // Mengonversi startTime ke objek waktu dengan timezone Jakarta
  const start = moment.tz(startTime, "HH:mm", "Asia/Jakarta");

  // Menambahkan durasi (menit) ke start time
  start.add(duration, "minute");

  // Mengembalikan dalam format 'HH:mm'
  return start.format("HH:mm");
}
export {
  getCurrentTime,
  formattedDate,
  getDuration,
  getDurationMinute,
  getEndTime,
  getEndDate,
  plusTime,
  getDayDuration
};
