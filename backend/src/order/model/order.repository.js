import OrderModel from "./order.schema.js";

export const createNewOrderRepo = async (data) => {
	// Write your code here for placing a new order
	return await new OrderModel(data).save();
};

export const getSingleOrderRepo = async (orderId) => {
	return await OrderModel.findById(orderId).populate({
		path: "user",
		model: "User",
		select: "profileImg name email",
	});
};

export const getMyOrdersRepo = async (userId) => {
	return await OrderModel.find({ user: userId });
};

export const getAllPlacedOrdersRepo = async () => {
	return await OrderModel.find().populate({
		path: "user",
		model: "User",
		select: "profileImg name email",
	});
};

export const updateOrderDetailsRepo = async (orderId, updatedData) => {
	return await OrderModel.findByIdAndUpdate(orderId, updatedData, {
		new: true,
		runValidators: true,
		useFindAndModify: true,
	});
};
