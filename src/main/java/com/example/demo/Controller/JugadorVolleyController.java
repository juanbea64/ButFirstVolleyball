package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.example.demo.Model.JugadorVolley;
import com.example.demo.Service.IJugadorVolleyService;

import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
public class JugadorVolleyController {

    @Autowired
    private IJugadorVolleyService jugadorVolleyService;

    @GetMapping("/")
    public String Inicio(Model model) {
        model.addAttribute("jugadorVoley", jugadorVolleyService.getAllJugadores());
        return "listar";
    }

    @GetMapping("/nuevo")
    public String Nuevo(Model model) {
        model.addAttribute("jugadorVoley",new JugadorVolley());
        return "nuevo";
    }

    @PostMapping("/guardar")
    public String Guardar(@ModelAttribute JugadorVolley jugadorVoley,Model model, RedirectAttributes attributes) {
        boolean resultado;
        String mensaje;
        
        // Detecta si es creación (sin ID) o actualización (con ID)
        if (jugadorVoley.getJugadorID() == null) {
            resultado = jugadorVolleyService.GuardarJugador(jugadorVoley);
            mensaje = "Jugador creado correctamente";
        } else {
            resultado = jugadorVolleyService.ActualizarJugador(jugadorVoley);
            mensaje = "Jugador actualizado correctamente";
        }
        
        if(!resultado){
            model.addAttribute("jugadorVoley", jugadorVoley);
            model.addAttribute("error", "Error al guardar el jugador. Verifique que el nombre no esté duplicado.");
            return "nuevo";
        }
        attributes.addFlashAttribute("success", mensaje);
        return "redirect:/";
    }

    @GetMapping("/editar/{id}")
    public String Editar(@PathVariable("id") Long id, Model model, RedirectAttributes attributes) {
        JugadorVolley jugadorVoley = jugadorVolleyService.BuscarJugadorById(id);
        if (jugadorVoley != null) {
            model.addAttribute("jugadorVoley", jugadorVoley);
            return "nuevo";
        }
        attributes.addFlashAttribute("error", "No se encontró jugador con id " + id);
        return "redirect:/";
    }

    @GetMapping("/eliminar/{id}")
    public String Eliminar(@PathVariable("id") Long id, RedirectAttributes attributes) {
        boolean resultado = jugadorVolleyService.EliminarJugadorById(id);
        if(resultado == false){
            attributes.addFlashAttribute("error", "Error al eliminar el jugador con id"+id);
            return "redirect:/";
        }
        attributes.addFlashAttribute("success", "Se eliminó el jugador correctamente");
        return "redirect:/";
    }
}
