package com.tienda.vehiculos.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "vehiculos")
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La marca es requerida")
    @Size(max = 50)
    @Column(nullable = false)
    private String marca;

    @NotBlank(message = "El modelo es requerido")
    @Size(max = 50)
    @Column(nullable = false)
    private String modelo;

    @NotNull(message = "El año es requerido")
    @Min(value = 1900, message = "Año inválido")
    @Column(nullable = false)
    private Integer anio;

    @NotNull(message = "El precio es requerido")
    @Min(value = 0, message = "El precio no puede ser negativo")
    @Column(nullable = false)
    private Double precio;

    @NotNull(message = "El kilometraje es requerido")
    @Min(value = 0, message = "El kilometraje no puede ser negativo")
    private Integer kilometraje;

    @NotBlank(message = "El tipo de combustible es requerido")
    private String combustible; // Gasolina, Diésel, Híbrido, Eléctrico

    @NotBlank(message = "La transmisión es requerida")
    private String transmision; // Automática, Manual

    @NotBlank(message = "El color es requerido")
    private String color;

    @NotBlank(message = "La categoría es requerida")
    private String categoria; // SUV, Sedán, Deportivo, Camioneta, Hatchback

    @Column(length = 2000)
    private String descripcion;

    @Column(length = 500)
    private String imagenUrl;

    @Column(nullable = false)
    private Boolean disponible = true;

    public Vehiculo() {
    }

    public Vehiculo(String marca, String modelo, Integer anio, Double precio, Integer kilometraje,
                    String combustible, String transmision, String color, String categoria,
                    String descripcion, String imagenUrl, Boolean disponible) {
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.precio = precio;
        this.kilometraje = kilometraje;
        this.combustible = combustible;
        this.transmision = transmision;
        this.color = color;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.imagenUrl = imagenUrl;
        this.disponible = disponible != null ? disponible : true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getKilometraje() {
        return kilometraje;
    }

    public void setKilometraje(Integer kilometraje) {
        this.kilometraje = kilometraje;
    }

    public String getCombustible() {
        return combustible;
    }

    public void setCombustible(String combustible) {
        this.combustible = combustible;
    }

    public String getTransmision() {
        return transmision;
    }

    public void setTransmision(String transmision) {
        this.transmision = transmision;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}
