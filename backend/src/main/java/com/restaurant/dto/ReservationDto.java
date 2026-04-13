package com.restaurant.dto;

import com.restaurant.entity.Reservation;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ReservationDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private Long tableId;
        private LocalDate reservationDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private Integer guestCount;
        private String specialRequests;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private LocalDate reservationDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private Integer guestCount;
        private String specialRequests;
        private Reservation.ReservationStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private Long tableId;
        private String tableNumber;
        private Integer tableCapacity;
        private String tableLocation;
        private LocalDate reservationDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private Integer guestCount;
        private Reservation.ReservationStatus status;
        private String specialRequests;
        private LocalDateTime createdAt;
    }
}
