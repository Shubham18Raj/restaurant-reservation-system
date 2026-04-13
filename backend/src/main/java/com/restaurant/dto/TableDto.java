package com.restaurant.dto;

import com.restaurant.entity.RestaurantTable;
import lombok.*;

public class TableDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String tableNumber;
        private Integer capacity;
        private String location;
        private String description;
        private RestaurantTable.TableStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String tableNumber;
        private Integer capacity;
        private RestaurantTable.TableStatus status;
        private String location;
        private String description;
    }
}
