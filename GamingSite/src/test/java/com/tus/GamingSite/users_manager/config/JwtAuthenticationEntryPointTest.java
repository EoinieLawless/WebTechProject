package com.tus.GamingSite.users_manager.config;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;


@ExtendWith(MockitoExtension.class)
class JwtAuthenticationEntryPointTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    @Test
    void shouldSendUnauthorizedError() throws IOException {
       
        JwtAuthenticationEntryPoint entryPoint = new JwtAuthenticationEntryPoint();

        entryPoint.commence(request, response, authException);

        verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}
