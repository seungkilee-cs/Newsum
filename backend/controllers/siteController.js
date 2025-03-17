import Site from "../models/site.js";

export const getSites = async (req, res) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (error) {
    console.error("Error fetching sites:", error);
    res.status(500).json({ message: "Error fetching sites" });
  }
};

export const createOrUpdateSites = async (req, res) => {
  const sites = req.body;

  try {
    const results = [];
    for (const site of sites) {
      const result = await Site.findOneAndUpdate(
        { name: site.name },
        { $set: { url: site.url, image: site.image } },
        { upsert: true, new: true },
      );
      results.push(result);
    }
    console.log("Sites inserted/updated in MongoDB:", results);
    res.status(200).json({
      message: "Sites inserted/updated successfully in MongoDB",
      results,
    });
  } catch (error) {
    console.error("Error inserting/updating sites in MongoDB:", error);
    res
      .status(500)
      .json({ message: "Error inserting/updating sites in MongoDB" });
  }
};
