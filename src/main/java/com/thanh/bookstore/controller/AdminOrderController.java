package com.thanh.bookstore.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.AdminOrderDto;
import com.thanh.bookstore.dto.OrderDto;
import com.thanh.bookstore.dto.UpdateOrderStatusRequest;
import com.thanh.bookstore.entity.enums.OrderStatus;
import com.thanh.bookstore.service.AdminOrderService;
import com.thanh.bookstore.service.OrderService;

import jakarta.validation.Valid;

/**
 * REST controller for admin order management.
 *
 * <p>All endpoints require ROLE_ADMIN — enforced by SecurityConfig.</p>
 */
@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;
    private final OrderService orderService;

    public AdminOrderController(AdminOrderService adminOrderService,
                                 OrderService orderService) {
        this.adminOrderService = adminOrderService;
        this.orderService = orderService;
    }

    /**
     * GET /api/admin/orders?status=PENDING&page=0&size=20
     * Returns paginated list of all orders, optionally filtered by status.
     */
    @GetMapping
    public ResponseEntity<Page<AdminOrderDto>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminOrderService.getAllOrders(status, pageable));
    }

    /**
     * GET /api/admin/orders/{id}
     * Returns full detail of a single order.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminOrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(adminOrderService.getOrderById(id));
    }

    /**
     * PATCH /api/admin/orders/{id}/status
     * Advances an order's status.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }
}