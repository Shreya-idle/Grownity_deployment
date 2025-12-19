export async function fetchUser(endpoint: string, query = "") {
  try {
    //previously imported /api/user
    const response = await fetch(`/api/${endpoint}${query}`, {
      credentials: "include", // send cookies if needed
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}