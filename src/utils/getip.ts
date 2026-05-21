export const getUserIp = async () => {
  try {
    const res = await fetch("https://api.ipify.org?format=json");

    const data = await res.json();

    console.log("🌍 USER IP:", data.ip);

    return data.ip;
  } catch (error) {
    console.log("❌ Failed to fetch IP:", error);

    return null;
  }
};
