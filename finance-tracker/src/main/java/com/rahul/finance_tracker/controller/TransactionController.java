package com.rahul.finance_tracker.controller;

import com.rahul.finance_tracker.dto.DashboardResponse;
import com.rahul.finance_tracker.dto.TransactionRequest;
import com.rahul.finance_tracker.entity.Transaction;
import com.rahul.finance_tracker.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService
    ) {
        this.transactionService =
                transactionService;
    }

    @PostMapping
    public Transaction addTransaction(
            @RequestBody TransactionRequest request
    ) {
        return transactionService.addTransaction(
                request
        );
    }

    @GetMapping("/{userId}")
    public List<Transaction> getTransactions(
            @PathVariable Long userId
    ) {
        return transactionService.getTransactions(
                userId
        );
    }

    @PutMapping("/{id}")
    public Transaction updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionRequest request
    ) {
        return transactionService
                .updateTransaction(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteTransaction(
            @PathVariable Long id
    ) {

        transactionService.deleteTransaction(id);

        return "Transaction deleted successfully";
    }

    @GetMapping("/dashboard/{userId}")
    public DashboardResponse getDashboard(
            @PathVariable Long userId
    ) {
    
        return transactionService
                .getDashboard(userId);
    }
}