import jwt from "jsonwebtoken";

export const generateAndSetToken = (user, res) => {
  const token = jwt.sign({ id: user._id,email:user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 70 * 24 * 60 * 60 * 1000,
  });
};
