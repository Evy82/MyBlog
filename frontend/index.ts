<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
    <script type="module">
      import React from 'https://unpkg.com/react@17/umd/react.production.min.js';
      import ReactDOM from 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js';
      import App from './App';
      const API_KEY = process.env.API_KEY;
      ReactDOM.render(<App apiKey={API_KEY} />, document.getElementById('root'));
    </script>
</body>
</html>