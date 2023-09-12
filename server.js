const express = require('express');
const moment = require('moment');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Define a custom middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Sorry there was an error!' });
});

function validateQueryParams(req, res, next) {
  const { slack_name, track } = req.query;

  if (!slack_name || !track) {
    return res.status(400).json({ error: 'Both slack Name and track are required.' });
  }

  next();
}

app.get('/api', validateQueryParams, (req, res) => {
  try {
    const { slack_name, track } = req.query;

    // Get the current day of the week
    const currentDay = moment().format('dddd');

    // Get the current UTC time with validation of +/-2 minutes
    const currentUtcTime = moment().utc().toISOString();

    // Build the JSON response
    const jsonResponse = {
      slack_name,
      current_day: currentDay,
      utc_time: currentUtcTime,
      track,
      github_file_url: 'https://github.com/Codedbx/zuri-firstApi/blob/main/server.js',
      github_repo_url: 'https://github.com/Codedbx/zuri-firstApi',
      status_code: 200,
    };

    res.json(jsonResponse);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
