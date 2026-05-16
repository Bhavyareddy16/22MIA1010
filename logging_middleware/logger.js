const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

const Log = async (stack, level, packageName, message) => {
  try {
    const token = process.env.LOG_ACCESS_TOKEN;

    if (!token) {
      console.error("Logging token is missing");
      return;
    }

    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Log failed", data);
      return;
    }

    return data;
  } catch (error) {
    console.error("Logging error", error.message);
  }
};

module.exports = Log;