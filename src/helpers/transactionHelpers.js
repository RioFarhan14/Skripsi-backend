import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { getCurrentTime, getEndDate } from "../utils/timeUtils.js";
import { validateMembership } from "../utils/validate.js";

const generateTransactionId = async (user_id_token) => {
  const lastTransaction = await prismaClient.transaction.findFirst({
    orderBy: {
      transaction_id: "desc",
    },
  });

  let newIdNumber = 1;
  if (lastTransaction && lastTransaction.transaction_id) {
    const lastIdNumber = parseInt(
      lastTransaction.transaction_id.slice(0, 3),
      10
    );
    newIdNumber = lastIdNumber + 1;
  }

  // Mengambil tiga digit pertama dari userId
  const userPrefix = String(user_id_token).padStart(3, "0").substring(0, 3);

  const now = new Date();
  // Mengubah waktu menjadi string lokal di zona waktu Jakarta
  const jakartaTimeString = now.toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  // Membuat objek Date baru dari string lokal
  const date = new Date(jakartaTimeString);
  // Membuat tanggal menjadi DDMMYY
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${date.getFullYear().toString().slice(-2)}`;

  const userId = `${newIdNumber
    .toString()
    .padStart(3, "0")}${userPrefix}${formattedDate}`;
  return userId;
};

const generateMembershipId = async (user_id_token) => {
  const lastmembership = await prismaClient.membership.findFirst({
    orderBy: {
      membership_id: "desc",
    },
  });

  let newIdNumber = 1;
  if (lastmembership && lastmembership.membership_id) {
    const lastIdNumber = parseInt(lastmembership.membership_id.slice(0, 3), 10);
    newIdNumber = lastIdNumber + 1;
  }

  // Mengambil tiga digit pertama dari userId
  const userPrefix = String(user_id_token).padStart(3, "0").substring(0, 3);

  const now = new Date();
  // Mengubah waktu menjadi string lokal di zona waktu Jakarta
  const jakartaTimeString = now.toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  // Membuat objek Date baru dari string lokal
  const date = new Date(jakartaTimeString);
  // Membuat tanggal menjadi DDMMYY
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${date.getFullYear().toString().slice(-2)}`;

  const userId = `${newIdNumber
    .toString()
    .padStart(3, "0")}${userPrefix}${formattedDate}`;
  return userId;
};

const calculateTotalAmount = (price, quantity, discount) => {
  let totalAmount = price * quantity;

  if (discount > 0) {
    totalAmount *= 1 - discount / 100;
  }

  return totalAmount;
};

const createTransactionRecord = async (user, user_id) => {
  const status = "PENDING";
  let result;
  if (!user.booking_id) {
    result = await prismaClient.transaction.create({
      data: {
        transaction_id: user.transaction_id,
        transaction_date: user.transaction_date,
        total_amount: user.total_amount,
        status: status,
        discount: user.discount,
        user: {
          connect: {
            user_id: user_id,
          },
        },
      },
      select: {
        transaction_id: true,
        total_amount: true,
      },
    });
  } else {
    result = await prismaClient.transaction.create({
      data: {
        transaction_id: user.transaction_id,
        booking: {
          connect: { booking_id: user.booking_id }, // Menghubungkan dengan booking_id
        },
        transaction_date: user.transaction_date,
        total_amount: user.total_amount,
        status: status,
        discount: user.discount,
        user: {
          connect: {
            user_id: user_id,
          },
        },
      },
      select: {
        transaction_id: true,
        total_amount: true,
      },
    });
  }

  if (!result) {
    throw new ResponseError(500, "Gagal membuat transaksi");
  }

  return result;
};

const createTransactionDetail = async (user, price) => {
  const result = await prismaClient.transaction_detail.create({
    data: {
      quantity: user.quantity,
      unit_price: price,
      transaction: {
        connect: {
          transaction_id: user.transaction_id,
        },
      },
      product: {
        connect: {
          product_id: user.product_id,
        },
      },
    },
  });

  if (!result) {
    throw new ResponseError(500, "Gagal membuat transaksi");
  }

  return;
};

const updateTransactionSuccess = async (transaction_id, payment_type) => {
  const result = await prismaClient.transaction.update({
    where: {
      transaction_id: transaction_id,
    },
    data: {
      payment: payment_type,
      status: "PAID",
      snap_token: "",
      snap_redirect_url: "",
    },
    select: {
      user_id: true,
      booking_id: true,
      transaction_details: {
        select: {
          product_id: true,
        },
      },
    },
  });

  if (result.booking_id) {
    await prismaClient.booking.update({
      where: {
        booking_id: result.booking_id,
      },
      data: {
        status: "Booked",
      },
    });
  } else {
    const productId = result.transaction_details[0]?.product_id;
    const product = await prismaClient.product.findUnique({
      where: {
        product_id: productId,
      },
      select: {
        product_name: true,
      },
    });

    const productQty = parseInt(product.product_name, 10);
    const calculate = productQty * 30;

    const validate = await validateMembership(result.user_id);
    if (validate) {
      await prismaClient.membership.update({
        where: {
          membership_id: validate.membership_id,
        },
        data: {
          end_date: getEndDate(validate.end_date, calculate),
        },
      });
      return;
    }
    const start_time = getCurrentTime();
    const end_time = getEndDate(start_time, calculate);
    const membershipId = await generateMembershipId(result.user_id);
    await prismaClient.membership.create({
      data: {
        membership_id: membershipId,
        user_id: result.user_id,
        start_date: start_time,
        end_date: end_time,
      },
    });
  }

  return;
};

const updateTransactionFail = async (transaction_id) => {
  const result = await prismaClient.transaction.update({
    where: {
      transaction_id: transaction_id,
    },
    data: {
      status: "CANCELLED",
      snap_token: "",
      snap_redirect_url: "",
    },
    select: {
      user_id: true,
      booking_id: true,
      transaction_details: {
        select: {
          product_id: true,
        },
      },
    },
  });

  if (result.booking_id) {
    await prismaClient.booking.update({
      where: {
        booking_id: result.booking_id,
      },
      data: {
        status: "Cancelled",
      },
    });
  }

  return;
};

export {
  calculateTotalAmount,
  createTransactionRecord,
  createTransactionDetail,
  generateTransactionId,
  updateTransactionSuccess,
  updateTransactionFail,
  generateMembershipId
};
