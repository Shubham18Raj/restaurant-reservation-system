package com.restaurant.controller;

import com.restaurant.dto.ReservationDto;
import com.restaurant.dto.TableDto;
import com.restaurant.service.ReservationService;
import com.restaurant.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class AdminController {

    private final ReservationService reservationService;
    private final TableService tableService;

    // ── Reservations ──────────────────────────────────────────────────────────

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDto.Response>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    @PutMapping("/reservations/{id}")
    public ResponseEntity<ReservationDto.Response> updateReservation(
            @PathVariable Long id,
            @RequestBody ReservationDto.UpdateRequest request) {
        return ResponseEntity.ok(reservationService.update(id, request));
    }

    // ── Tables ────────────────────────────────────────────────────────────────

    @PostMapping("/tables")
    public ResponseEntity<TableDto.Response> addTable(@RequestBody TableDto.Request request) {
        return ResponseEntity.ok(tableService.create(request));
    }

    @PutMapping("/tables/{id}")
    public ResponseEntity<TableDto.Response> updateTable(@PathVariable Long id,
                                                          @RequestBody TableDto.Request request) {
        return ResponseEntity.ok(tableService.update(id, request));
    }

    @DeleteMapping("/tables/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
