module.exports = {
  apps: [
    {
      name: 'quiz-backend',
      script: 'dist/main.js', // Run the compiled JS file directly
      // This line tells Node.js to load the .env file before starting
      node_args: '-r dotenv/config',
    },
  ],
};
