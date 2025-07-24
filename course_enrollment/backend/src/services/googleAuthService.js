const { OAuth2Client } = require("google-auth-library");
const { findUserByEmail } = require("../models/authModel");
const {
  updateGoogleId,
  createUserWithGoogle,
} = require("../models/googleAuthModel");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const googleLoginInit = (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });
  res.redirect(authUrl);
};

const googleLoginCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload["email"];
    const googleId = payload["sub"];
    const fullName = payload["name"];

    let user = await findUserByEmail(email);
    if (user) {
      if (!user.googleId) {
        await updateGoogleId(user.userId, googleId);
        user = await findUserByEmail(email);
      }
    } else {
      const newUserData = {
        userFullName: fullName,
        userEmail: email,
        userRole: "Student",
        userStatus: "Active",
        googleId: googleId,
      };
      await createUserWithGoogle(newUserData);
      user = await findUserByEmail(email);
    }
    const token = jwt.sign(
      {
        userId: user.userId,
        userEmail: user.userEmail,
        userFullName: user.userFullName,
        userRole: user.userRole,
        userStatus: user.userStatus,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const urlObj = new URL(frontendUrl);
    const origin = urlObj.origin;
    const html = `
      <html><body>
        <script>
          (function() {
            if (window.opener) {
              window.opener.postMessage({
                token: ${JSON.stringify(token)},
                user: ${JSON.stringify({
                  userId: user.userId,
                  userEmail: user.userEmail,
                  userFullName: user.userFullName,
                  userRole: user.userRole,
                  userStatus: user.userStatus,
                  userPhoneNumber: user.userPhoneNumber || "",
                })}
              }, "${origin}");
              window.close();
            }
          })();
        </script>
      </body></html>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).json({ message: "Lỗi xác thực Google." });
    console.error(`Lỗi: ${err.message}`);
    console.error(err.response?.data || err);
  }
};

module.exports = { googleLoginInit, googleLoginCallback };
