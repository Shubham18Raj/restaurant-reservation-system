package com.restaurant.repository;

import com.restaurant.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {

    List<RestaurantTable> findByStatus(RestaurantTable.TableStatus status);

    List<RestaurantTable> findByCapacityGreaterThanEqual(Integer capacity);

    @Query("""
        SELECT t FROM RestaurantTable t
        WHERE t.capacity >= :guests
        AND t.status = 'AVAILABLE'
        AND t.id NOT IN (
            SELECT r.table.id FROM Reservation r
            WHERE r.reservationDate = :date
            AND r.status IN ('PENDING','CONFIRMED')
            AND NOT (r.endTime <= :startTime OR r.startTime >= :endTime)
        )
    """)
    List<RestaurantTable> findAvailableTables(
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("guests") Integer guests
    );
}
