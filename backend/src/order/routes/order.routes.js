import express from "express";
import {
	createNewOrder,
	getAllPlacedOrders,
	getMyOrders,
	getSingleOrder,
	updateOrderDetails,
} from "../controllers/order.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();

// GET Routes
router.route("/:id").get(auth, getSingleOrder);
router.route("/my/orders").get(auth, getMyOrders);
// Admin only
router
	.route("/orders/placed")
	.get(auth, authByUserRole("admin"), getAllPlacedOrders);

// POST Routes
router.route("/new").post(auth, createNewOrder);

// PUT ROUTE
// Admin only
router
	.route("/update/:id")
	.put(auth, authByUserRole("admin"), updateOrderDetails);

export default router;
