package com.restaurant.controller;

import com.restaurant.dto.ReservationDto;
import com.restaurant.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationDto.Response> create(@RequestBody ReservationDto.CreateRequest request) {
        return ResponseEntity.ok(reservationService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationDto.Response>> getMyReservations() {
        return ResponseEntity.ok(reservationService.getMyReservations());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationDto.Response> update(@PathVariable Long id,
                                                          @RequestBody ReservationDto.UpdateRequest request) {
        return ResponseEntity.ok(reservationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        reservationService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}
