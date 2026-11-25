package com.tienda.vehiculos.controllers;

import com.tienda.vehiculos.dto.AuthResponse;
import com.tienda.vehiculos.dto.LoginRequest;
import com.tienda.vehiculos.dto.MensajeResponse;
import com.tienda.vehiculos.dto.RegisterRequest;
import com.tienda.vehiculos.models.Rol;
import com.tienda.vehiculos.models.Usuario;
import com.tienda.vehiculos.repositories.UsuarioRepository;
import com.tienda.vehiculos.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> autenticarUsuario(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            Usuario usuario = usuarioRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String jwt = jwtUtil.generateToken(userDetails, usuario.getRol().name(), usuario.getNombreCompleto());

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    usuario.getId(),
                    usuario.getUsername(),
                    usuario.getNombreCompleto(),
                    usuario.getEmail(),
                    usuario.getRol().name()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MensajeResponse("Credenciales incorrectas: usuario o contraseña inválidos", false));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MensajeResponse("Error en la autenticación: " + e.getMessage(), false));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody RegisterRequest registerRequest) {
        if (usuarioRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MensajeResponse("El nombre de usuario ya está en uso", false));
        }

        if (usuarioRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MensajeResponse("El correo electrónico ya está registrado", false));
        }

        Usuario nuevoUsuario = new Usuario(
                registerRequest.getUsername(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getNombreCompleto(),
                registerRequest.getEmail(),
                Rol.ROLE_USER
        );

        usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensajeResponse("Usuario registrado exitosamente. Ya puedes iniciar sesión.", true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> obtenerUsuarioActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MensajeResponse("No hay sesión activa", false));
        }

        String username = auth.getName();
        return usuarioRepository.findByUsername(username)
                .map(user -> ResponseEntity.ok(new AuthResponse(
                        null,
                        user.getId(),
                        user.getUsername(),
                        user.getNombreCompleto(),
                        user.getEmail(),
                        user.getRol().name()
                )))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
