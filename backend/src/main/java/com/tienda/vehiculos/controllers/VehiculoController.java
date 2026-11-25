package com.tienda.vehiculos.controllers;

import com.tienda.vehiculos.dto.MensajeResponse;
import com.tienda.vehiculos.models.Vehiculo;
import com.tienda.vehiculos.services.VehiculoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VehiculoController {

    private final VehiculoService vehiculoService;

    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }

    @GetMapping
    public ResponseEntity<List<Vehiculo>> obtenerVehiculos(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String busqueda) {

        if (marca != null || categoria != null || busqueda != null) {
            return ResponseEntity.ok(vehiculoService.filtrarVehiculos(marca, categoria, busqueda));
        }
        return ResponseEntity.ok(vehiculoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return vehiculoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body((Vehiculo) null));
    }

    @GetMapping("/marcas")
    public ResponseEntity<List<String>> obtenerMarcas() {
        return ResponseEntity.ok(vehiculoService.obtenerMarcas());
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<String>> obtenerCategorias() {
        return ResponseEntity.ok(vehiculoService.obtenerCategorias());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> crearVehiculo(@Valid @RequestBody Vehiculo vehiculo) {
        try {
            Vehiculo guardado = vehiculoService.guardar(vehiculo);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MensajeResponse("Error al crear vehículo: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> actualizarVehiculo(@PathVariable Long id, @Valid @RequestBody Vehiculo vehiculo) {
        try {
            Vehiculo actualizado = vehiculoService.actualizar(id, vehiculo);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MensajeResponse("Error al actualizar vehículo: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> eliminarVehiculo(@PathVariable Long id) {
        try {
            vehiculoService.eliminar(id);
            return ResponseEntity.ok(new MensajeResponse("Vehículo eliminado exitosamente con ID: " + id, true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MensajeResponse("No se pudo eliminar el vehículo: " + e.getMessage(), false));
        }
    }
}
