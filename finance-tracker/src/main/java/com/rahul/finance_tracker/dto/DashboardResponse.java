package com.rahul.finance_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private Double income;
    private Double expense;
    private Double balance;
}