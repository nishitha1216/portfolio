const http = require("http"); // Native HTTP module
const fs = require("fs"); // File system module
const path = require("path"); // For file paths
const { MongoClient } = require("mongodb"); // MongoDB driver

// MongoDB connection details 
const MONGO_URL = "mongodb+srv://ntapr1:Nisha%401612@cluster0.l3q4o.mongodb.net/weatherdata?retryWrites=true&w=majority";
const DB_NAME = "weatherdata";
const COLLECTION_NAME = "weathers"; 

// Helper function to get content type based on file extension
function getContentType(ext) {
  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpeg";
    default:
      return "text/plain";
  }
}
app.use(cors({
  origin: 'http://localhost:8080'  // Allow only requests from this domain
}));

// Create HTTP server
const server = http.createServer(async (req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    // Serve the portfolio website (index.html)
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.url === "/api") {
    // Connect to MongoDB and return data from a specific collection
    try {
      const client = await MongoClient.connect(MONGO_URL);
      const db = client.db(DB_NAME);

      // Fetch data from your collection
      const data = await db.collection(COLLECTION_NAME).find().toArray();

      // Send the data as JSON response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));

      client.close();
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Database connection failed", error: error.message }));
    }
  } else {
    // Serve static files (CSS, JS, images, etc.)
    const filePath = path.join(__dirname, "public", req.url);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(200, { "Content-Type": getContentType(ext) });
        res.end(data);
      }
    });
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
