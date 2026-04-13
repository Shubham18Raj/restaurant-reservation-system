package com.restaurant.config;

import com.restaurant.entity.RestaurantTable;
import com.restaurant.entity.User;
import com.restaurant.repository.TableRepository;
import com.restaurant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TableRepository tableRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedTables();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@restaurant.com")) return;
        userRepository.save(User.builder()
            .name("Admin User")
            .email("admin@restaurant.com")
            .password(passwordEncoder.encode("admin123"))
            .role(User.Role.ADMIN)
            .phone("+91-9876543210")
            .build());
        System.out.println("✅ Admin seeded: admin@restaurant.com / admin123");
    }

    private void seedTables() {
        if (tableRepository.count() > 0) return;
        List<RestaurantTable> tables = List.of(
            RestaurantTable.builder().tableNumber("T1").capacity(2).location("Indoor").description("Cozy window seat").status(RestaurantTable.TableStatus.AVAILABLE).build(),
            RestaurantTable.builder().tableNumber("T2").capacity(4).location("Indoor").description("Central dining area").status(RestaurantTable.TableStatus.AVAILABLE).build(),
            RestaurantTable.builder().tableNumber("T3").capacity(4).location("Indoor").description("Near the fireplace").status(RestaurantTable.TableStatus.AVAILABLE).build(),
            RestaurantTable.builder().tableNumber("T4").capacity(6).location("Indoor").description("Family booth").status(RestaurantTable.TableStatus.AVAILABLE).build(),
            RestaurantTable.builder().tableNumber("T5").capacity(2).location("Outdoor").description("Garden view").status(RestaurantTable.TableStatus.AVAILABLE).build(),
            RestaurantTable.builder().tableNumber("T6").capacity(4).location("Outdoor").description("Terrace seating").status(RestaurantTable.TableStatus.AVAILABLE).build(),
            RestaurantTable.builder().tableNumber("T7").capacity(8).location("Private").description("Private dining room").status(RestaurantTable.TableStatus.AVAILABLE).build(),
            RestaurantTable.builder().tableNumber("T8").capacity(2).location("Bar").description("Bar counter seats").status(RestaurantTable.TableStatus.AVAILABLE).build()
        );
        tableRepository.saveAll(tables);
        System.out.println("✅ 8 tables seeded.");
    }
}
