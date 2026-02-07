module.exports = {
  apps: [
    {
      name: 'nara-translation-scheduler',
      script: './scheduledJobs/autoTranslationScheduler.js',
      instances: 1,
      autorestart: false, // Don't auto-restart, let cron handle it
      max_memory_restart: '1G',
      cron_restart: '0 6,18 * * *', // Run at 6 AM and 6 PM every day
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Colombo'
      },
      error_file: './logs/translation-error.log',
      out_file: './logs/translation-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
