// Please don't change the pre-written code
// Import the necessary modules here

import {
	createNewOrderRepo,
	getAllPlacedOrdersRepo,
	getMyOrdersRepo,
	getSingleOrderRepo,
	updateOrderDetailsRepo,
} from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { getProductDetailsRepo } from "../../product/model/product.repository.js";

export const createNewOrder = async (req, res, next) => {
	// Write your code here for placing a new order
	try {
		const orderDetails = req.body;
		orderDetails.user = req.user._id;
		let itemsPrice = 0;

		for (const item of orderDetails.orderedItems) {
			const product = await getProductDetailsRepo(item.product);
			if (!product) {
				return next(new ErrorHandler(400, "Product not found!"));
			}

			item.name = product.name;
			item.price = product.price;
			item.quantity = item.quantity || 1;

			itemsPrice += item.quantity * item.price;
		}

		if (orderDetails.paymentInfo.status) {
			orderDetails.paidAt = Date.now();
		} else {
			return next(new ErrorHandler(400, "Payment is required"));
		}

		if (orderDetails.itemsPrice !== itemsPrice) {
			orderDetails.itemsPrice = itemsPrice;
		}

		orderDetails.taxPrice = orderDetails.taxPrice || 0;
		orderDetails.shippingPrice = orderDetails.shippingPrice || 0;
		orderDetails.totalPrice =
			orderDetails.itemsPrice +
			orderDetails.shippingPrice +
			orderDetails.taxPrice;

		const order = await createNewOrderRepo(orderDetails);

		return res.status(201).json({
			success: true,
			order: order,
		});
	} catch (err) {
		return next(new ErrorHandler(500, err));
	}
};

export const getSingleOrder = async (req, res, next) => {
	try {
		const orderId = req.params.id;
		const order = await getSingleOrderRepo(orderId);
		if (!order) {
			return next(new ErrorHandler(400, "Order not found"));
		}
		if (
			req.user.role !== "admin" &&
			order.user.toString() !== req.user._id.toString()
		) {
			return next(new ErrorHandler(401, "Unauthorised"));
		}
		return res.status(200).json({
			success: true,
			order,
		});
	} catch (err) {
		return next(new ErrorHandler(500, err));
	}
};

export const getMyOrders = async (req, res, next) => {
	try {
		const userId = req.user._id;
		const orders = await getMyOrdersRepo(userId);

		return res.status(200).json({
			success: true,
			orders,
		});
	} catch (err) {
		return next(new ErrorHandler(500, err));
	}
};

export const getAllPlacedOrders = async (req, res, next) => {
	try {
		const orders = await getAllPlacedOrdersRepo();

		return res.status(200).json({
			success: true,
			orders,
		});
	} catch (err) {
		return next(new ErrorHandler(500, err));
	}
};

export const updateOrderDetails = async (req, res, next) => {
	try {
		const orderId = req.params.id;
		const order = await updateOrderDetailsRepo(orderId, req.body);

		return res.status(201).json({
			success: true,
			order,
		});
	} catch (err) {
		return next(new ErrorHandler(500, err));
	}
};
