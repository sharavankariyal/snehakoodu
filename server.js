const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(express.static(__dirname));  // Serve HTML files
app.use(express.static('uploads'));  // Serve uploaded images

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

let uploadedData = { images: [], description: '' };

// Route to display the main gallery page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to display the upload page
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});

// Handle the image uploads and description
app.post('/upload', upload.array('images', 5), (req, res) => {
  const files = req.files;
  const description = req.body.description;

  if (!files || files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  files.forEach(file => {
    uploadedData.images.push({ url: `/${file.filename}` });
  });

  uploadedData.description = description;

  res.send(`
    <h2>Images Uploaded:</h2>
    ${files.map(file => `<a href="/${file.filename}">View ${file.filename}</a>`).join('<br>')}
    <h2>Description:</h2>
    <p>${description}</p>
    <a href="/">Back to Gallery</a>
  `);
});

// Route to get uploaded images and description
app.get('/get-uploads', (req, res) => {
  res.json(uploadedData);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
