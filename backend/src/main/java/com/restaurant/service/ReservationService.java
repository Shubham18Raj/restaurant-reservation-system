package com.restaurant.service;

import com.restaurant.dto.ReservationDto;
import com.restaurant.entity.*;
import com.restaurant.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final TableRepository tableRepository;

    public ReservationDto.Response create(ReservationDto.CreateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        RestaurantTable table = tableRepository.findById(request.getTableId())
            .orElseThrow(() -> new RuntimeException("Table not found"));

        Reservation reservation = Reservation.builder()
            .user(user)
            .table(table)
            .reservationDate(request.getReservationDate())
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .guestCount(request.getGuestCount())
            .specialRequests(request.getSpecialRequests())
            .status(Reservation.ReservationStatus.PENDING)
            .build();

        return toResponse(reservationRepository.save(reservation));
    }

    public ReservationDto.Response getById(Long id) {
        return toResponse(findById(id));
    }

    public List<ReservationDto.Response> getMyReservations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return reservationRepository.findByUserId(user.getId())
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReservationDto.Response> getAll() {
        return reservationRepository.findAll()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ReservationDto.Response update(Long id, ReservationDto.UpdateRequest request) {
        Reservation reservation = findById(id);
        if (request.getReservationDate() != null) reservation.setReservationDate(request.getReservationDate());
        if (request.getStartTime() != null) reservation.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) reservation.setEndTime(request.getEndTime());
        if (request.getGuestCount() != null) reservation.setGuestCount(request.getGuestCount());
        if (request.getSpecialRequests() != null) reservation.setSpecialRequests(request.getSpecialRequests());
        if (request.getStatus() != null) reservation.setStatus(request.getStatus());
        return toResponse(reservationRepository.save(reservation));
    }

    public void cancel(Long id) {
        Reservation reservation = findById(id);
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    private Reservation findById(Long id) {
        return reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));
    }

    private ReservationDto.Response toResponse(Reservation r) {
        return ReservationDto.Response.builder()
            .id(r.getId())
            .userId(r.getUser().getId())
            .userName(r.getUser().getName())
            .userEmail(r.getUser().getEmail())
            .tableId(r.getTable().getId())
            .tableNumber(r.getTable().getTableNumber())
            .tableCapacity(r.getTable().getCapacity())
            .tableLocation(r.getTable().getLocation())
            .reservationDate(r.getReservationDate())
            .startTime(r.getStartTime())
            .endTime(r.getEndTime())
            .guestCount(r.getGuestCount())
            .status(r.getStatus())
            .specialRequests(r.getSpecialRequests())
            .createdAt(r.getCreatedAt())
            .build();
    }
}
