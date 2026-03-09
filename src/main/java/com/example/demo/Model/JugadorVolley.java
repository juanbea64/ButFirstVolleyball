package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
@Table(name="tbl_jugadores")
public class JugadorVolley {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long jugadorID;
    @Column(nullable = false, unique = true)
    private String nombreJugador;
    private int edadJugador;
    private String raza;
    private String color;
    private String posicion;
    private double altura;
    private double peso;
    private String equipo;
    private int numeroCamiseta;

    public Long getJugadorID() {
        return jugadorID;
    }

    public void setJugadorID(Long jugadorID) {
        this.jugadorID = jugadorID;
    }

    public String getNombreJugador() {
        return nombreJugador;
    }

    public void setNombreJugador(String nombreJugador) {
        this.nombreJugador = nombreJugador;
    }

    public int getEdadJugador() {
        return edadJugador;
    }

    public void setEdadJugador(int edadJugador) {
        this.edadJugador = edadJugador;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getPosicion() {
        return posicion;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }

    public double getAltura() {
        return altura;
    }

    public void setAltura(double altura) {
        this.altura = altura;
    }

    public double getPeso() {
        return peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }

    public String getEquipo() {
        return equipo;
    }

    public void setEquipo(String equipo) {
        this.equipo = equipo;
    }

    public int getNumeroCamiseta() {
        return numeroCamiseta;
    }

    public void setNumeroCamiseta(int numeroCamiseta) {
        this.numeroCamiseta = numeroCamiseta;
    }
}