function fn() {
  var config = {
    baseUrl: 'http://localhost:8082/api',
    authToken: ''
  };

  karate.log('🚀 Karate config loaded, baseUrl is:', config.baseUrl);

  return config;
}
