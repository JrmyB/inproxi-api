module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // INPROXI API
    {
      name      : 'inproxi-api',
      script    : './index.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'jrmy',
      host : '51.15.165.55',
      key  : '~/.ssh/id_rsa',
      ref  : 'origin/master',
      repo : 'git@github.com:JrmyB/inproxi-api.git',
      path : '/var/www/inproxi-api-production',
      'post-deploy' : 'exec zsh && npm install && pm2 reload ecosystem.config.js --env production',
      env  : {
	NODE_ENV: 'production'
      }
    },
    development : {
      user : 'jrmy',
      host : '51.15.165.55',
      key  : '~/.ssh/id_rsa',
      ref  : 'origin/development',
      repo : 'git@github.com:JrmyB/inproxi-api.git',
      path : '/var/www/inproxi-api-development',
      'post-deploy' : 'exec zsh && npm install && pm2 reload ecosystem.config.js --env development',
      env  : {
        NODE_ENV: 'development'
      }
    }
  }
};
