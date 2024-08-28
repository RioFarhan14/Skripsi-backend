import { prismaClient } from "../application/database.js";

export const generateProductId = async () => {
  const getId = await prismaClient.product.findFirst({
    orderBy: {
      product_id: "desc",
    },
  });

  let newIdNumber = 1; // Ubah const menjadi let
  if (getId) {
    newIdNumber = getId.product_id + 1; // Sekarang ini diperbolehkan
  }
  return newIdNumber;
};
