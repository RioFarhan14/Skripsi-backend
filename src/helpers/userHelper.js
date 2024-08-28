import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
const generateUserId = async (role) => {
  const lastUser = await prismaClient.user.findFirst({
    orderBy: {
      user_id: "desc",
    },
  });

  let newIdNumber = 1;
  if (lastUser && lastUser.user_id) {
    const lastIdNumber = parseInt(lastUser.user_id.slice(0, 3), 10);
    newIdNumber = lastIdNumber + 1;
  }

  const now = new Date();
  // Mengubah waktu menjadi string lokal di zona waktu Jakarta
  const jakartaTimeString = now.toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  // Membuat objek Date baru dari string lokal
  const date = new Date(jakartaTimeString);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${date.getFullYear().toString().slice(-2)}`;

  if (role === "user") {
    const userId = `${newIdNumber
      .toString()
      .padStart(3, "0")}02${formattedDate}`;
    return userId;
  }
  const userId = `${newIdNumber.toString().padStart(3, "0")}01${formattedDate}`;
  return userId;
};

const validateInput = async (user) => {
  const data = {};
  if (user.username) {
    // Check for existing username
    const existingUsername = await prismaClient.user.findFirst({
      where: {
        username: user.username,
      },
    });

    if (existingUsername) {
      throw new ResponseError(400, "Username sudah digunakan");
    } else {
      data.username = user.username;
    }
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }
  if (user.name) {
    data.name = user.name;
  }
  if (user.user_phone) {
    // Check for existing phone number
    const existingPhone = await prismaClient.user.findFirst({
      where: {
        user_phone: user.user_phone,
      },
    });

    if (existingPhone) {
      throw new ResponseError(400, "Nomor telepon sudah digunakan");
    } else {
      data.user_phone = user.user_phone;
    }
  }
  return data;
};

export { validateInput, generateUserId };
