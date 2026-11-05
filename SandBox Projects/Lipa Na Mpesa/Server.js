
require("dotenv").config();

async function testDarajaConnection() {
  const key = process.env.DARAJA_CONSUMER_KEY;
  const secret = process.env.DARAJA_CONSUMER_SECRET;

  if (!key || !secret) {
    console.error("Missing Daraja credentials in .env");
    process.exitCode = 1;
    return;
  }

  const credentials = Buffer.from(
    `${key}:${secret}`
  ).toString("base64");

  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate" +
    "?grant_type=client_credentials";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`
      }
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      console.error(
        "Authentication failed:",
        data.errorMessage || data.error || response.status
      );
      process.exitCode = 1;
      return;
    }

    console.log("Daraja authentication successful!");
    console.log("Access token received.");
    console.log("Token expiry:", data.expires_in, "seconds");
  } catch {
    console.error(
      "Could not connect to Daraja. Check your internet connection."
    );
    process.exitCode = 1;
  }
}

testDarajaConnection();
