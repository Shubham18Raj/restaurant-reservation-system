package com.restaurant.controller;

import com.restaurant.dto.TableDto;
import com.restaurant.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @GetMapping
    public ResponseEntity<List<TableDto.Response>> getAll() {
        return ResponseEntity.ok(tableService.getAll());
    }

    @GetMapping("/available")
    public ResponseEntity<List<TableDto.Response>> getAvailable(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @RequestParam Integer guests) {
        return ResponseEntity.ok(tableService.getAvailable(date, startTime, endTime, guests));
    }
}
