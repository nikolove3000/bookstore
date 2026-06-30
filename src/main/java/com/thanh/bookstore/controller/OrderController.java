package com.thanh.bookstore.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.CheckoutRequest;
import com.thanh.bookstore.dto.OrderDto;
import com.thanh.bookstore.dto.OrderSummaryDto;
import com.thanh.bookstore.dto.UpdateOrderStatusRequest;
import com.thanh.bookstore.entity.User;
import com.thanh.bookstore.service.OrderService;
import com.thanh.bookstore.service.UserService;

import jakarta.validation.Valid;

/**
 * REST controller for order checkout and history endpoints.
 *
 * <p>
 * All endpoints require authentication — orders always belong to the currently
 * logged-in user.</p>
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    /**
     * POST /api/orders/checkout Places an order from the current user's cart.
     */
    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(orderService.checkout(currentUser(), request));
    }

    /**
     * POST /api/orders/{id}/cancel Cancels a pending order and restocks its
     * items.
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(currentUser(), id));
    }

    /**
     * GET /api/orders Returns paginated order history for the current user.
     */
    @GetMapping
    public ResponseEntity<Page<OrderSummaryDto>> getOrderHistory(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrderHistory(currentUser(), pageable));
    }

    /**
     * GET /api/orders/{id} Returns full detail of a single order.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(currentUser(), id));
    }

    // ── private ──────────────────────────────────────────
    private User currentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }

    /**
     * PATCH /api/admin/orders/{id}/status Advances an order's status. Admin
     * only — temporary endpoint until a full staff dashboard is built.
     */
    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }
}
