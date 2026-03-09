package com.example.Actividad1.Controller;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Actividad1.DTO.PersonaDTO;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api")
public class SaludoController {

    @GetMapping("/hola")
    public String saludo() {
        return "¡Hola, mundo de srping boot!";
    }

    @GetMapping("/saludo")
    public String saludar(@RequestParam(defaultValue = "Invitado") String nombre) {
        return "¡Hola, " + nombre + " de Spring Boot!";
    }

    @GetMapping("/eco")
    public String ecoget() {
        return "Endpoint Eco Activo , usar POST para enviar un SONIDO";
    }

    @PostMapping("/eco")
    public Map<String, Object> ecoPost(@RequestBody Map<String, Object> payload) {
        return Map.of(
            "mensaje", "Recibido correctamente",
            "recibido", payload,
            "fecha", LocalDateTime.now().toString()
        );
    }
  
    @PostMapping("/persona")
    public Map<String, Object> crearPersona(@Valid @RequestBody PersonaDTO persona) {
        // Si los datos no son válidos, Spring devolverá un error 400 automáticamente
        return Map.of(
            "mensaje", "Persona recibida correctamente",
            "recibido", persona,
            "fecha", LocalDateTime.now().toString()
        );
    }
}


