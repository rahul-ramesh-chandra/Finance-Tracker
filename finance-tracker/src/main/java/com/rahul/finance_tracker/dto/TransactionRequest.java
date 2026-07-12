package com.rahul.finance_tracker.dto;

import lombok.Data;

@Data
public class TransactionRequest {

    private String title;
    private Double amount;
    private String type;
    private String category;
    private String date;
    private Long userId;
}