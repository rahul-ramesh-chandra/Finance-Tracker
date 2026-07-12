package com.rahul.finance_tracker.service;

import com.rahul.finance_tracker.dto.DashboardResponse;
import com.rahul.finance_tracker.dto.TransactionRequest;
import com.rahul.finance_tracker.entity.Transaction;
import com.rahul.finance_tracker.entity.TransactionType;
import com.rahul.finance_tracker.entity.User;
import com.rahul.finance_tracker.repository.TransactionRepository;
import com.rahul.finance_tracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public Transaction addTransaction(
            TransactionRequest request
    ) {

        User user = userRepository.findById(
                request.getUserId()
        ).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        Transaction transaction =
            Transaction.builder()
                    .title(request.getTitle())
                    .amount(request.getAmount())
                    .type(
                        TransactionType.valueOf(
                            request.getType().toUpperCase()
                        )
                    )
                    .category(request.getCategory())
                    .date(LocalDate.parse(request.getDate()))
                    .user(user)
                    .build();

        return transactionRepository.save(
                transaction
        );
    }

    public List<Transaction> getTransactions(
            Long userId
    ) {

        User user = userRepository.findById(
                userId
        ).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        return transactionRepository.findByUser(
                user
        );
    }

    public Transaction updateTransaction(
        Long id,
        TransactionRequest request
    ) {

        Transaction transaction =
                transactionRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Transaction not found"
                                )
                        );

        transaction.setTitle(request.getTitle());
        transaction.setAmount(request.getAmount());
        transaction.setType(
            TransactionType.valueOf(
                request.getType().toUpperCase()
            )
        );
        transaction.setCategory(request.getCategory());
        transaction.setDate(
                LocalDate.parse(request.getDate())
        );

        return transactionRepository.save(
                transaction
        );
    }

    public void deleteTransaction(Long id) {

        Transaction transaction =
                transactionRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Transaction not found"
                                )
                        );

        transactionRepository.delete(
                transaction
        );
    }
    
    public DashboardResponse getDashboard(
            Long userId
    ) {
    
        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
            
        List<Transaction> transactions =
                transactionRepository.findByUser(user);
            
        double income = 0;
        double expense = 0;
            
        for (Transaction transaction :
                transactions) {
                
            if (transaction.getType() == TransactionType.INCOME) {
                income += transaction.getAmount();
            } else {
                expense += transaction.getAmount();
            }
        }
    
        double balance = income - expense;
    
        return new DashboardResponse(
                income,
                expense,
                balance
        );
    }
}