import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createTransactionValidation,
  getTransactionValidation,
} from "../validation/transaction-validation.js";
import { formattedDate, getCurrentTime, getEndDate } from "../utils/timeUtils.js";
import {
  validateMembership,
  validateProduct,
  validateUser,
} from "../utils/validate.js";
import {
  calculateTotalAmount,
  createTransactionDetail,
  createTransactionRecord,
  generateMembershipId,
  generateTransactionId,
} from "../helpers/transactionHelpers.js";

const getAllTransaction = async (user_id) => {
  user_id = validate(getTransactionValidation, user_id);

  const checkUserInDatabase = await validateUser(user_id);

  if (checkUserInDatabase.role !== "admin") {
    throw new ResponseError(403, "user tidak memiliki izin akses");
  }

  const result = await prismaClient.transaction.findMany(
    {
      select: {
        transaction_id: true,
        transaction_date: true,
        status: true,
        payment: true,
        total_amount: true,
        user: {
          select: {
            name: true,
          },
        }
      },
    }
  );
  const data = result.map((item) => {
    return {
      id: item.transaction_id,
      transaction_date: formattedDate(item.transaction_date, "DD-MM-YYYY"),
      status: item.status,
      payment: item.payment || "Belum dibayar",
      total_amount: Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.total_amount),
      name: item.user.name,
    };
  });
  
  return data;
};

const getUserHistoryTransaction = async (user_id) => {
  user_id = validate(getTransactionValidation, user_id);

  const checkUserInDatabase = await validateUser(user_id);

  if (checkUserInDatabase.role !== "user") {
    throw new ResponseError(403, "user tidak memiliki izin akses");
  }

  return prismaClient.transaction.findMany({
    where: {
      user_id: user_id,
      OR: [{ status: "PAID" }, { status: "CANCELLED" }],
    },
    select: {
      transaction_date: true,
      status: true,
      payment: true,
      transaction_date: true,
      transaction_details: {
        select: {
          product: {
            select: {
              product_name: true,
              product_type: true,
            },
          },
        },
      },
    },
  });
};

const create = async (request) => {
  const user = validate(createTransactionValidation, request);

  // validasi user_id pada database
  const checkUserInDatabase = await validateUser(user.user_id_token);

  if (checkUserInDatabase.role === "admin" && !user.user_id) {
    throw new ResponseError(400, "user_id wajib diisi");
  }

  // validasi product_id pada database
  const checkProductInDatabase = await validateProduct(user.product_id);

  // Gunakan user_id jika admin dan gunakan user_id_token jika user
  const user_id =
    checkUserInDatabase.role == "admin" ? user.user_id : user.user_id_token;

  // Dapatkan waktu sekarang timezone jakarta
  const currentTime = getCurrentTime();
  const isMember = await validateMembership(user_id, currentTime);

  if (!isMember) {
    user.discount = 0;
  } else {
    user.discount = 20;
  }

  user.total_amount = calculateTotalAmount(
    checkProductInDatabase.price,
    user.quantity,
    user.discount
  );

  user.transaction_id = await generateTransactionId(user.user_id_token);

  user.transaction_date = getCurrentTime();

  const CreateTransaction = await createTransactionRecord(user, user_id);

  await createTransactionDetail(user, checkProductInDatabase.price);

  const result = {};
  result.transaction_id = CreateTransaction.transaction_id;
  result.total_amount = CreateTransaction.total_amount;
  return result;
};

const update = async (request) => {
  const result = await prismaClient.booking.update({
    where: {
      booking_id: request.orderId,
    },
    data: {
      status: request.status,
    },
  });

  if (result) {
    prismaClient.transaction.update({
      where: { transaction_id: request.orderId },
      data: {
        status: request.status,
      },
    });
  }
};

const updateTransactionCash = async (transaction_id) => {

  const validatedTransaction = await prismaClient.transaction.findUnique({
    where: {
      transaction_id: transaction_id
    },
  })

  if (!validatedTransaction) {
    throw new ResponseError(404, "Transaction not found")
  }

  const result = await prismaClient.transaction.update({
    where: {
      transaction_id: transaction_id,
    },
    data: {
      status: "PAID",
      payment: "CASH",
    },
  });

  return result;
};

const membershipPayment = async (user_id,product_id) => {

  const product = await prismaClient.product.findUnique({
    where: {
      product_id: product_id
    }
  });

  const productQty = parseInt(product.product_name, 10);
  const calculate = productQty * 30;
  const validate = await validateMembership(user_id);
  if(validate){
    return prismaClient.membership.update({
      where: {
        membership_id: validate.membership_id
      },
      data: {
        end_date: getEndDate(validate.end_date, calculate)
      }
    })
  }
    const start_time = getCurrentTime();
    const end_time = getEndDate(start_time, calculate);
    const membershipId = await generateMembershipId(user_id);
    return prismaClient.membership.create({
      data: {
        membership_id: membershipId,
        user_id: user_id,
        start_date: start_time,
        end_date: end_time,
      },
    });
}

export default {
  getAllTransaction,
  getUserHistoryTransaction,
  update,
  updateTransactionCash,
  membershipPayment,
  create,
};
