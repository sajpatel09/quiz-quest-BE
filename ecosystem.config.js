module.exports = {
  apps: [
    {
      name: 'quiz-backend',
      script: 'npm',
      args: 'run start:prod', // This is the standard command to run a production NestJS build
    },
  ],
};
