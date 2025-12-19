import fetch from "node-fetch";



export const getCitiesByState = async (req, res) => {
  const { state } = req.query;


  if (!state) {
    return res.status(400).json({ error: "State is required" });
  }


  try {
    console.log("Fetching from API");
    const response = await fetch(
      `https://indian-cities-api-nocbegfhqg.now.sh/cities?state=${state.toLowerCase()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );


const data = await response.json();



console.log(data);
res.json(data);
} catch (error) {
  console.error("Error fetching cities:", error);
  res.status(500).json({ error: error.message || "Failed to fetch cities" });
}
};