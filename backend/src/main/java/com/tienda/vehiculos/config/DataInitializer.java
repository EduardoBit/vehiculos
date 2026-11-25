package com.tienda.vehiculos.config;

import com.tienda.vehiculos.models.Vehiculo;
import com.tienda.vehiculos.repositories.VehiculoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final VehiculoRepository vehiculoRepository;

    public DataInitializer(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        inicializarVehiculos();
    }

    private void inicializarVehiculos() {
        if (vehiculoRepository.count() == 0) {
            List<Vehiculo> catalogo = List.of(
                    new Vehiculo(
                            "Porsche", "911 Carrera S", 2024, 135000.0, 4500,
                            "Gasolina", "Automática", "Rojo Carmín", "Deportivo",
                            "Motor Boxer 3.0L Twin-Turbo con 450 CV. Aceleración de 0 a 100 km/h en 3.5 segundos. Equipamiento interior en piel natural y escape deportivo.",
                            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "BMW", "M4 Competition", 2023, 89900.0, 12000,
                            "Gasolina", "Automática", "Azul Portimao", "Deportivo",
                            "510 CV con tracción trasera pura. Frenos carbocerámicos M, asientos envolventes de fibra de carbono y techo en carbono.",
                            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "Mercedes-Benz", "G-Class AMG G63", 2024, 195000.0, 2000,
                            "Gasolina", "Automática", "Negro Obsidiana", "SUV",
                            "Legendario todoterreno con motor V8 Biturbo de 585 CV. Lujo extremo, sonido inconfundible y tracción 4x4 con tres bloqueos de diferencial.",
                            "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "Tesla", "Model S Plaid", 2023, 98500.0, 15000,
                            "Eléctrico", "Automática", "Blanco Perla", "Sedán",
                            "1.020 CV de potencia con aceleración 0-100 km/h en 2.1 segundos. Autonomía estimada de 600 km con sistema Autopilot avanzado.",
                            "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "Toyota", "RAV4 Hybrid Limited", 2024, 43500.0, 6200,
                            "Híbrido", "Automática", "Plata Metalizado", "SUV",
                            "Eficiencia y comodidad sin igual. Tracción electrónica en las 4 ruedas (AWD-i), consumo promedio de 4.7 L/100km y tecnología Toyota Safety Sense.",
                            "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "Ford", "F-150 Raptor", 2023, 84000.0, 21000,
                            "Gasolina", "Automática", "Gris Plomo", "Camioneta",
                            "Camioneta de alto rendimiento todoterreno. Motor 3.5L V6 EcoBoost High-Output de 450 CV, amortiguadores FOX Live Valve y neumáticos de 35 pulgadas.",
                            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "Audi", "RS6 Avant", 2024, 142000.0, 3100,
                            "Híbrido", "Automática", "Gris Nardo", "Sedán",
                            "Familiar superdeportivo con 600 CV y sistema Mild-Hybrid. Tracción total quattro, suspensión neumática adaptativa y faros Matrix LED HD.",
                            "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "Ford", "Mustang Mach 1", 2022, 59000.0, 18500,
                            "Gasolina", "Manual", "Naranja Twister", "Deportivo",
                            "Motor 5.0L V8 Coyote de 480 CV con caja manual Tremec de 6 velocidades. Frenos Brembo y paquete aerodinámico específico.",
                            "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "Toyota", "Hilux GR-Sport", 2023, 51000.0, 16000,
                            "Diésel", "Automática", "Blanco Glaciar", "Camioneta",
                            "Inspirada en el Rally Dakar. Suspensión monotubo ajustada por Gazoo Racing, robustez probada y capacidad de remolque de 3.5 toneladas.",
                            "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80",
                            true
                    ),
                    new Vehiculo(
                            "Mercedes-Benz", "C300 Sedan", 2023, 49800.0, 14000,
                            "Híbrido", "Automática", "Negro Noche", "Sedán",
                            "Elegancia moderna con tecnología MBUX de última generación, pantalla vertical de 11.9 pulgadas e iluminación ambiental de 64 colores.",
                            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
                            true
                    )
            );

            vehiculoRepository.saveAll(catalogo);
            System.out.println(">> [DATA] Catálogo inicial de 10 vehículos cargado exitosamente.");
        }
    }
}
