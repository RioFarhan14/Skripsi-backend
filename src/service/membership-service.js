import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { getUserValidation } from "../validation/user-validation.js";
import { validateUser } from "../utils/validate.js";
import { formattedDate, getCurrentTime, getDayDuration } from "../utils/timeUtils.js";
const get = async (user_id) => {
    user_id = validate(getUserValidation, user_id);
  
    const Role = await validateUser(user_id);

    if(Role.role !== "admin") {
        throw new ResponseError(403, "user tidak memiliki izin akses");
    }

    const currentTime = getCurrentTime(); 
    const data = await prismaClient.membership.findMany(
        {
            where: {
                end_date: {
                    gte: currentTime,
                  },
            },
            select: {
                membership_id: true,
                start_date: true,
                end_date: true,
                user: {
                    select: {
                        name: true,
                    }
                }
            }
        }
    );

    const result = data.map((item) => {
        return {
            id: item.membership_id,
            name: item.user.name,
            start_date: formattedDate(item.start_date, "DD-MM-YYYY"),
            end_date: formattedDate(item.end_date, "DD-MM-YYYY"),
            duration: `${getDayDuration(item.start_date, item.end_date)} Hari`,
        };
    });

    return result;
  };

  export default { get };