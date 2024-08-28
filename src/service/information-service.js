import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { validateUser } from "../utils/validate.js";
import { getCardInformationValidation } from "../validation/information-validation.js";
import { getUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";

const getCardInformation = async (request) => {
    const user = validate(getCardInformationValidation, request);

    const role = await validateUser(user.user_id);
    if (role.role !== "admin") {
        throw new ResponseError(403, "user tidak memiliki izin akses");
    }

    if (user.type === "transaction") {
        const transactionsThisMonth = await prismaClient.transaction.count({
            where: {
                transaction_date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                }
            }
        });
        
        const transactionsThisYear = await prismaClient.transaction.count({
            where: {
                transaction_date: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                    lt: new Date(new Date().getFullYear() + 1, 0, 1)
                }
            }
        });
        
        return {
            transactions_this_month: transactionsThisMonth,
            transactions_this_year: transactionsThisYear
        };
    } else if (user.type === "membership") {
        const membershipThisMonth = await prismaClient.membership.count({
            where: {
                start_date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                }
            }
        });
        
        const membershipThisYear = await prismaClient.membership.count({
            where: {
                start_date: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                    lt: new Date(new Date().getFullYear() + 1, 0, 1)
                }
            }
        });
        return {
            membership_this_month: membershipThisMonth,
            membership_this_year: membershipThisYear
        };
    } else if (user.type === "income") {
        const incomeThisMonth = await prismaClient.transaction.aggregate({
            _sum: {
                total_amount: true
            },
            where: {
                transaction_date: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                },
                status: "PAID"
            }
        });
        
        const incomeThisYear = await prismaClient.transaction.aggregate({
            _sum: {
                total_amount: true
            },
            where: {
                transaction_date: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                    lt: new Date(new Date().getFullYear() + 1, 0, 1)
                },
                status: "PAID"
            }
        });
        return {
            income_this_month: incomeThisMonth._sum.total_amount,
            income_this_year: incomeThisYear._sum.total_amount
        };
    }
};

const getChardInformation = async (request) => {
    const user = validate(getCardInformationValidation, request);
    const role = await validateUser(user.user_id);
  
    if (role.role !== "admin") {
      throw new ResponseError(403, "User tidak memiliki izin akses");
    }
  
    const today = new Date();
    const month = new Date();
    month.setMonth(today.getMonth() - 4);
  
    const day = new Date();
    day.setDate(today.getDate() - 4);
  
    const year = new Date();
    year.setFullYear(today.getFullYear() - 4);
  
    // Deklarasikan transactionDateRange di luar blok kondisional
    let transactionDateRange;
    const aggregationPeriod = user.type === 'month' ? 'month' :
                               user.type === 'year' ? 'year' : 'day';
  
    if (user.type === 'year') {
      transactionDateRange = year;
    } else if (user.type === 'month') {
      transactionDateRange = month;
    } else if (user.type === 'day') {
      transactionDateRange = day;
    }
  
    // Ambil data transaksi dengan status 'PAID'
    const transactions = await prismaClient.transaction.findMany({
      where: {
        status: 'PAID',
        transaction_date: {
          gte: transactionDateRange,
          lte: today,
        },
      },
      orderBy: {
        transaction_date: 'asc',
      },
    });
  
    // Agregasi data manual per periode
    const totals = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.transaction_date);
      const label = date.toLocaleString('id-ID', {
        [aggregationPeriod]: aggregationPeriod === 'month' ? 'long' : 'numeric',
      });
  
      if (!acc[label]) {
        acc[label] = 0;
      }
  
      acc[label] += transaction.total_amount;
      return acc;
    }, {});
  
    // Buat daftar periode waktu yang diinginkan
    const periods = [];
    let startDate = new Date();
  
    for (let i = 3; i >= 0; i--) {
      const period = new Date();
      if (aggregationPeriod === 'month') {
        period.setMonth(startDate.getMonth() - i);
        periods.push(period.toLocaleString('id-ID', { month: 'long' }));
      } else if (aggregationPeriod === 'year') {
        period.setFullYear(startDate.getFullYear() - i);
        periods.push(period.toLocaleString('id-ID', { year: 'numeric' }));
      } else {
        period.setDate(startDate.getDate() - i);
        periods.push(period.toLocaleString('id-ID', { day: 'numeric' }));
      }
    }
  
    // Pastikan semua periode ada di hasil
    const formattedData = periods.map((period) => ({
      label: period,
      value: totals[period] || 0,
    }));
  
    return formattedData;
  }

  const getCustomerMostSpent = async (user_id) => {
    user_id = validate(getUserValidation, user_id);
  
    const role = await validateUser(user_id);
  
    if (role.role !== "admin") {
      throw new ResponseError(403, "User tidak memiliki izin akses");
    }
  
    // Aggregate total spending and transaction count by user
    const userSpending = await prismaClient.transaction.groupBy({
      by: ['user_id'], // Group by user_id
      where: {
        status: 'PAID',
      },
      _count: {
        // Count the number of transactions
        transaction_id: true, // This will count the number of transactions
      },
      _sum: {
        total_amount: true,
      },
      orderBy: {
        _sum: {
          total_amount: 'desc', // Sort by total spending in descending order
        },
      },
      take: 5, // Get top 5 customers
    });
  
    // Get user details including names
    const userIds = userSpending.map(({ user_id }) => user_id);
    
    const users = await prismaClient.user.findMany({
      where: {
        user_id: {
          in: userIds,
        },
      },
      select: {
        user_id: true,
        name: true,
      },
    });
  
    // Map user IDs to names
    const userMap = new Map(users.map(user => [user.user_id, user.name]));
  
    // Return results with names and transaction count
    return userSpending.map(({ user_id, _sum, _count }) => ({
      id: user_id,
      name: userMap.get(user_id) || 'Unknown',
      total_amount: Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(_sum.total_amount), // Format total spending as currency (IDR)
      transaction_count: _count.transaction_id, // Total number of transactions
    }));
  };
  
  const getFieldMostBuyed = async (request) => {
    // Validate the user from the request
    const user = validate(getCardInformationValidation, request);
  
    // Check the user's role
    const role = await validateUser(user.user_id);
    if (role.role !== "admin") {
      throw new ResponseError(403, "User tidak memiliki izin akses");
    }
  
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
  
    // Determine the date range based on the user's selected type
    let dateRangeStart;
    let dateRangeEnd = today; // The end date is today
  
    switch (user.type) {
      case 'year':
        dateRangeStart = startOfYear;
        break;
      case 'month':
        dateRangeStart = startOfMonth;
        break;
      case 'day':
        dateRangeStart = startOfDay;
        break;
      default:
        throw new ResponseError(400, "Invalid type. Please choose 'day', 'month', or 'year'.");
    }
  
    // Fetch all products
    const allProducts = await prismaClient.product.findMany({
        where: {
            product_type: "field",
        },
      select: {
        product_id: true,
        product_name: true,
      },
    });
  
    // Create a map of all products for later reference
    const productMap = new Map(allProducts.map(product => [product.product_id, product.product_name]));
  
    // Group and count transactions by product_id within the specified date range
    const productCounts = await prismaClient.transaction_detail.groupBy({
      by: ['product_id'],
      _count: {
        product_id: true,
      },
      where: {
        transaction: {
          status: 'PAID',
          booking_id: { not: null },
          transaction_date: {
            gte: dateRangeStart,
            lte: dateRangeEnd,
          },
        },
      },
      orderBy: {
        _count: {
          product_id: 'desc',
        },
      },
    });
  
    // Create a map of product counts for quick lookup
    const countMap = new Map(productCounts.map(({ product_id, _count }) => [product_id, _count.product_id]));
  
    // Format the result to include all products, even those with zero count
    const formattedData = allProducts.map(product => ({
      label: product.product_name,
      value: countMap.get(product.product_id) || 0, // Default to 0 if no count found
    }));
  
    return formattedData;
  };
  
    

export default { getCardInformation, getChardInformation , getCustomerMostSpent, getFieldMostBuyed};