package com.tienda.vehiculos.services;

import com.tienda.vehiculos.models.Vehiculo;
import com.tienda.vehiculos.repositories.VehiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    @Transactional(readOnly = true)
    public List<Vehiculo> listarTodos() {
        return vehiculoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Vehiculo> obtenerPorId(Long id) {
        return vehiculoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Vehiculo> filtrarVehiculos(String marca, String categoria, String busqueda) {
        String cleanMarca = (marca != null && !marca.trim().isEmpty()) ? marca.trim() : null;
        String cleanCategoria = (categoria != null && !categoria.trim().isEmpty()) ? categoria.trim() : null;
        String cleanBusqueda = (busqueda != null && !busqueda.trim().isEmpty()) ? busqueda.trim() : null;

        return vehiculoRepository.filtrarVehiculos(cleanMarca, cleanCategoria, cleanBusqueda);
    }

    @Transactional(readOnly = true)
    public List<String> obtenerMarcas() {
        return vehiculoRepository.findDistinctMarcas();
    }

    @Transactional(readOnly = true)
    public List<String> obtenerCategorias() {
        return vehiculoRepository.findDistinctCategorias();
    }

    public Vehiculo guardar(Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }

    public Vehiculo actualizar(Long id, Vehiculo datosActualizados) {
        return vehiculoRepository.findById(id).map(vehiculo -> {
            vehiculo.setMarca(datosActualizados.getMarca());
            vehiculo.setModelo(datosActualizados.getModelo());
            vehiculo.setAnio(datosActualizados.getAnio());
            vehiculo.setPrecio(datosActualizados.getPrecio());
            vehiculo.setKilometraje(datosActualizados.getKilometraje());
            vehiculo.setCombustible(datosActualizados.getCombustible());
            vehiculo.setTransmision(datosActualizados.getTransmision());
            vehiculo.setColor(datosActualizados.getColor());
            vehiculo.setCategoria(datosActualizados.getCategoria());
            vehiculo.setDescripcion(datosActualizados.getDescripcion());
            vehiculo.setImagenUrl(datosActualizados.getImagenUrl());
            vehiculo.setDisponible(datosActualizados.getDisponible());
            return vehiculoRepository.save(vehiculo);
        }).orElseThrow(() -> new RuntimeException("Vehículo no encontrado con ID: " + id));
    }

    public void eliminar(Long id) {
        if (!vehiculoRepository.existsById(id)) {
            throw new RuntimeException("Vehículo no encontrado con ID: " + id);
        }
        vehiculoRepository.deleteById(id);
    }
}
