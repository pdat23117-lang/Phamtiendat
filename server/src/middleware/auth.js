const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (
  req,
  res,
  next
) => {

  try {

    let token;

    if (

      req.headers.authorization &&

      req.headers.authorization.startsWith(
        "Bearer"
      )

    ) {

      token =
        req.headers.authorization.split(
          " "
        )[1];

    }

    if (!token) {

      return res.status(401).json({

        message:
          "Không có quyền truy cập",

      });

    }

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET

      );

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    if (!user) {

      return res.status(401).json({

        message:
          "Người dùng không tồn tại",

      });

    }

    req.user = user;

    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({

      message:
        "Token không hợp lệ",

    });

  }

};

module.exports = {
  protect,
};