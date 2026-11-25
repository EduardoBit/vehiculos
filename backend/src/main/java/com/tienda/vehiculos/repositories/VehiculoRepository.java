package com.tienda.vehiculos.repositories;

import com.tienda.vehiculos.models.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {

    List<Vehiculo> findByCategoriaIgnoreCase(String categoria);

    List<Vehiculo> findByMarcaIgnoreCase(String marca);

    List<Vehiculo> findByDisponibleTrue();

    @Query("SELECT DISTINCT v.marca FROM Vehiculo v ORDER BY v.marca ASC")
    List<String> findDistinctMarcas();

    @Query("SELECT DISTINCT v.categoria FROM Vehiculo v ORDER BY v.categoria ASC")
    List<String> findDistinctCategorias();

    @Query("SELECT v FROM Vehiculo v WHERE " +
           "(:marca IS NULL OR LOWER(v.marca) = LOWER(:marca)) AND " +
           "(:categoria IS NULL OR LOWER(v.categoria) = LOWER(:categoria)) AND " +
           "(:busqueda IS NULL OR LOWER(v.marca) LIKE LOWER(CONCAT('%', :busqueda, '%')) " +
           "OR LOWER(v.modelo) LIKE LOWER(CONCAT('%', :busqueda, '%')) " +
           "OR LOWER(v.categoria) LIKE LOWER(CONCAT('%', :busqueda, '%')))")
    List<Vehiculo> filtrarVehiculos(
            @Param("marca") String marca,
            @Param("categoria") String categoria,
            @Param("busqueda") String busqueda
    );
}
