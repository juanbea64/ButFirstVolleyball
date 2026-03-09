package com.example.demo.Service;

import java.util.List;

import com.example.demo.Model.JugadorVolley;

public interface IJugadorVolleyService {

    public List<JugadorVolley> getAllJugadores();

    public boolean GuardarJugador(JugadorVolley jugadorVolley);

    public JugadorVolley BuscarJugadorById(int id);

    public boolean ActualizarJugador(JugadorVolley jugadorVolley);

    public boolean EliminarJugadorById(int id);

}
