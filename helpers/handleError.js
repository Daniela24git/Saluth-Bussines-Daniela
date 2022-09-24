module.exports = (error, res) => {
  if (error.name === "ValidationError") {
    res.status(400).json({ error: error.message });
  } else if (error.name === "MongoError") {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: error.message });
  }
};