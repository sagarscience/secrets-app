import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { strict } from "assert";

dotenv.config();
const app = express();

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.set("view engine", "ejs");

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Error:", err));

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  secrets: [String],
});

const User = mongoose.model("User", userSchema);

// Middleware: Authenticate JWT
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
}

// Routes
app.get("/", (req, res) => res.redirect("/login"));

app.get("/register", (req, res) => res.render("register"));

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.send(`
      <script>
        alert("⚠️ You have already registered. Please login.");
        window.location.href = "/login";
      </script>
    `);
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,15}$/;
  if (!passwordPattern.test(password)) {
    return res.send(`
      <script>
        alert("❌ Password must have 1 uppercase, 1 lowercase, 1 digit and be 6-15 characters long.");
        window.location.href = "/register";
      </script>
    `);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });
  res.send(`
    <script>
      alert("✅ Registration successful. Please login.");
      window.location.href = "/login";
    </script>
  `);
});

app.get("/login", (req, res) => res.render("login"));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.send(`
        <script> 
        alert("❌ Email not registered!");
        window.location.href = "/register";
        </script>
        `);
  }

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.send("❌ Incorrect password");

  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET
  );
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/secret");
});

app.get("/submit", authenticateToken, (req, res) => {
  res.render("submit");
});

app.post("/submit", authenticateToken, async (req, res) => {
  const { secret } = req.body;

  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { secrets: secret },
    });

    res.redirect("/secret");
  } catch (err) {
    console.error("❌ Failed to save secret:", err);
    res.redirect("/login");
  }
});


app.get("/secret", authenticateToken, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id).select("-password");
    res.render("secret", { user: userData });
  } catch (err) {
    console.error("❌ Failed to load secrets:", err);
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.get("/edit/:index", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  const secretIndex = req.params.index;
  const currentSecret = user.secrets[secretIndex];

  res.render("edit", { secret: currentSecret, index: secretIndex });
});

app.post("/edit/:index", authenticateToken, async (req, res) => {
  const { updatedSecret } = req.body;
  const index = req.params.index;

  const user = await User.findById(req.user.id);
  user.secrets[index] = updatedSecret;
  await user.save();

  res.redirect("/secret");
});

app.post("/delete/:index", authenticateToken, async (req, res) => {
  const index = req.params.index;

  const user = await User.findById(req.user.id);
  user.secrets.splice(index, 1);
  await user.save();

  res.redirect("/secret");
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
