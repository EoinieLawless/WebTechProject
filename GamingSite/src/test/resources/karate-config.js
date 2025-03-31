function fn() {
  var config = {
	baseUrl: 'http://host.docker.internal:9091/api',
    authToken: ''
  };

  // Call login.feature exactly once to get a token,
  // and pass baseUrl, username, and password as parameters.
  var authResponse = karate.callSingle('classpath:features/login.feature', { 
      baseUrl: config.baseUrl, 
      username: 'admin', 
      password: 'admin' 
  });
  config.authToken = authResponse.jwt;
  return config;
}
