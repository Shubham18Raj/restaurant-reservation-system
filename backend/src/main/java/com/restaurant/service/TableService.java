package com.restaurant.service;

import com.restaurant.dto.TableDto;
import com.restaurant.entity.RestaurantTable;
import com.restaurant.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;

    public List<TableDto.Response> getAll() {
        return tableRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TableDto.Response> getAvailable(LocalDate date, LocalTime startTime, LocalTime endTime, Integer guests) {
        return tableRepository.findAvailableTables(date, startTime, endTime, guests)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TableDto.Response create(TableDto.Request request) {
        RestaurantTable table = RestaurantTable.builder()
            .tableNumber(request.getTableNumber())
            .capacity(request.getCapacity())
            .location(request.getLocation())
            .description(request.getDescription())
            .status(request.getStatus() != null ? request.getStatus() : RestaurantTable.TableStatus.AVAILABLE)
            .build();
        return toResponse(tableRepository.save(table));
    }

    public TableDto.Response update(Long id, TableDto.Request request) {
        RestaurantTable table = tableRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Table not found: " + id));
        if (request.getTableNumber() != null) table.setTableNumber(request.getTableNumber());
        if (request.getCapacity() != null) table.setCapacity(request.getCapacity());
        if (request.getLocation() != null) table.setLocation(request.getLocation());
        if (request.getDescription() != null) table.setDescription(request.getDescription());
        if (request.getStatus() != null) table.setStatus(request.getStatus());
        return toResponse(tableRepository.save(table));
    }

    public void delete(Long id) {
        tableRepository.deleteById(id);
    }

    private TableDto.Response toResponse(RestaurantTable t) {
        return TableDto.Response.builder()
            .id(t.getId())
            .tableNumber(t.getTableNumber())
            .capacity(t.getCapacity())
            .status(t.getStatus())
            .location(t.getLocation())
            .description(t.getDescription())
            .build();
    }
}
