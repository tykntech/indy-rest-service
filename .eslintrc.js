module.exports = {
    root: true,
  
    parserOptions: {      
      sourceType: 'module',
      ecmaVersion: 2017 
    },
  
    env: {
      browser: true,
    },
  
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    extends: [      
      'eslint-config-prettier',
    ],
  
    // required to lint *.vue files
    plugins: [],
  
    globals: {
      ga: true, // Google Analytics
      cordova: true,
      __statics: true,
      process: true,
      Capacitor: true,
      chrome: true,
    },
  
    // add your custom rules here
    rules: {
      'prefer-promise-reject-errors': 'off',
        
      // allow debugger during development only
      'no-debugger':
        process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  };
  