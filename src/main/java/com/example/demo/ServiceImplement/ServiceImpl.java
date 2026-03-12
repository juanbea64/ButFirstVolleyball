package com.example.demo.ServiceImplement;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.JugadorVolley;
import com.example.demo.Repository.IJugadorVolleyRepository;
import com.example.demo.Service.IJugadorVolleyService;
 // Implementación de la interfaz de servicio para manejar la lógica de negocio relacionada con los jugadores de voleibol
 @Service
public class ServiceImpl implements IJugadorVolleyService {

    @Autowired  // Inyección de dependencia del repositorio, no crear instancia manualmente
    private IJugadorVolleyRepository jugadorVolleyRepository;

    @Override // Implementación del método para obtener todos los jugadores
    public List<JugadorVolley> getAllJugadores() {
        return jugadorVolleyRepository.findAll();
    }

    @Override
    public boolean GuardarJugador(JugadorVolley jugadorVolley) {
        try {
            jugadorVolleyRepository.save(jugadorVolley);
            return true; // Retorna true si el jugador se guarda correctamente
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Retorna false si ocurre un error al guardar el jugador
        }
    }

    @Override
    public JugadorVolley BuscarJugadorById(Long id) {
        return jugadorVolleyRepository.findById(id).orElse(null); // Busca un jugador por su ID, retorna null si no se encuentra
    }

    @Override
    public boolean ActualizarJugador(JugadorVolley jugadorVolley) {
        try {
            jugadorVolleyRepository.save(jugadorVolley); // save() actualiza si el ID existe
            return true; // Retorna true si el jugador se actualiza correctamente
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Retorna false si ocurre un error al actualizar el jugador
        }
    }

    @Override
    public boolean EliminarJugadorById(Long id) {
        try {
            jugadorVolleyRepository.deleteById(id); // Elimina un jugador por su ID
            return true; // Retorna true si el jugador se elimina correctamente
        } catch (Exception e) {
            e.printStackTrace();
            return false; // Retorna false si ocurre un error al eliminar el jugador
        }
    }

}
