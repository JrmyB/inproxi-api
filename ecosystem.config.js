module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // INPROXI API
    {
      name: 'inproxi-api-prod',
      script: './index.js',
      'exec_mode': 'cluster',
      env_production: {
	NODE_ENV: 'production'
      }
    },
    {
      name: 'inproxi-api-dev',
      script: './index.js',
      'exec_mode': 'cluster',
      env_development: {
	NODE_ENV: 'development'
      }
    }    
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'user',
      host : 'ip_address',
      key  : '~/.ssh/id_rsa',
      ref  : 'origin/master',
      repo : '-b master git@github.com:JrmyB/inproxi-api.git',
      path : '/var/www/inproxi-api-production',
      'post-deploy' : 'source ~/.zshrc && npm install && pm2 reload ecosystem.config.js --update-env --only inproxi-api-prod --env production --update-env'
    },
    development : {
      user : 'user',
      host : 'ip_address',
      key  : '~/.ssh/id_rsa',
      ref  : 'origin/development', 
      repo : '-b development git@github.com:JrmyB/inproxi-api.git',
      path : '/var/www/inproxi-api-development',
      'post-deploy' : 'source ~/.zshrc && npm install && pm2 reload ecosystem.config.js --update-env --only inproxi-api-dev --env development --update-env'
    }
  }
};
