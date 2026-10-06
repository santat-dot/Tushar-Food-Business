import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ message: "Administrator sign-in is required." });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Your admin session has expired. Please sign in again." });
  }
}

export async function loginAdmin(req, res) {
  const { username, password } = req.body ?? {};
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!process.env.ADMIN_USERNAME || !configuredPassword || !process.env.JWT_SECRET) {
    return res.status(503).json({ message: "Admin credentials are not configured on the API server." });
  }

  const usernameMatches = typeof username === "string" && username === process.env.ADMIN_USERNAME;
  const passwordMatches = typeof password === "string" && (
    configuredPassword.startsWith("$2")
      ? await bcrypt.compare(password, configuredPassword)
      : password === configuredPassword
  );

  if (!usernameMatches || !passwordMatches) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET, { expiresIn: "8h" });
  return res.json({ token, username });
}
