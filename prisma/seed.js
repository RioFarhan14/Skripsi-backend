// prisma/seed.js

import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // Buat data contoh
  await prisma.user.create({
    data: {
      user_id: "00101000000",
      username: "admin",
      password: await hash("password", 10),
      name: "admin",
      user_phone: "12345678111",
      role: "admin",
    },
  });
  await prisma.product.createMany({
    data: [
      {
        product_id: 1,
        product_name: "Lapangan A",
        product_type: "field",
        image_url: "product1.png",
        price: 120000,
        description:
          "Lapangan A adalah pilihan sempurna untuk berbagai kegiatan olahraga dan rekreasi. Menawarkan fasilitas berkualitas dengan harga yang kompetitif. Lapangan A terletak paling depan dari lapangan futsal yang ada.",
      },
      {
        product_id: 2,
        product_name: "Lapangan B",
        product_type: "field",
        image_url: "product2.png",
        price: 120000,
        description:
          "Lapangan A adalah pilihan sempurna untuk berbagai kegiatan olahraga dan rekreasi. Menawarkan fasilitas berkualitas dengan harga yang kompetitif. Lapangan B berada di belakang lapangan A.",
      },
      {
        product_id: 3,
        product_name: "Lapangan C",
        product_type: "field",
        image_url: "product3.png",
        price: 120000,
        description:
          "Lapangan C adalah pilihan sempurna untuk berbagai kegiatan olahraga dan rekreasi. Menawarkan fasilitas berkualitas dengan harga yang kompetitif. Lapangan C terletak paling belakang dari lapangan futsal yang ada.",
      },
      {
        product_id: 4,
        product_name: "1",
        product_type: "membership",
        image_url: "product4.png",
        price: 50000,
        description:
          "Membership 1 bulan adalah pilihan sempurna untuk berlangganan. Menawarkan keuntungan lebih dibanding pengguna biasa. Membership 1 bulan berlaku selama 1 bulan.",
      },
      {
        product_id: 5,
        product_name: "2",
        product_type: "membership",
        image_url: "product5.png",
        price: 100000,
        description:
          "Membership 2 bulan adalah pilihan sempurna untuk berlangganan. Menawarkan keuntungan lebih dibanding pengguna biasa. Membership 2 bulan berlaku selama 2 bulan.",
      },
    ],
  });
  await prisma.categoryOnNotification.createMany({
    data: [
      {
        category_id: 1,
        category_name: "info",
      },
      {
        category_id: 2,
        category_name: "promo",
      },
    ],
  });
  console.log("Data telah dimasukkan.");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
