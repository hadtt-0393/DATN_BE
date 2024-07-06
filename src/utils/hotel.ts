/** @format */

import serviceHotelSchema from "../models/serviceHotel";
import FormSchema from "../models/form";
interface Hotel {
	serviceIds: string[];
	toObject: () => any;
	listRoomAvailable?: string[];
}

async function getHotelsByService(hotels: any[]) {
	const resultHotels = await Promise.all(
		hotels.map(async (hotel) => {
			const services = await serviceHotelSchema.find({
				_id: { $in: hotel.serviceIds },
			});
			return {
				...hotel,
				services: services.map((item) => item.serviceName),
			};
		})
	);
	return resultHotels;
}

async function getHotelsByRating(hotel: any) {
	const forms = await FormSchema.find({ hotelId: { $in: hotel!._id } });
	if (forms.length === 0) {
		return { ...hotel };
	}
	const formFilter = forms.filter((form) => form.rating);
    if (formFilter.length === 0) {
        return { ...hotel };
    }

	let ratingAvg;
	let cleanlinessAvg;
	let serviceAvg;
	let comfortableAvg;
	let facilitiesAvg;
	let countComments;
	let countForms = forms.length;
	if (formFilter.length === 0) {
		return { ...hotel, countForms };
	}
	ratingAvg =
		formFilter.reduce((total, form) => total + form.rating, 0) /
		formFilter.length;
	cleanlinessAvg =
		formFilter.reduce(
			(total, form) => total + form.comment.cleanliness,
			0
		) / formFilter.length;
	serviceAvg =
		formFilter.reduce((total, form) => total + form.comment.service, 0) /
		formFilter.length;
	comfortableAvg =
		formFilter.reduce(
			(total, form) => total + form.comment.comfortable,
			0
		) / formFilter.length;
	facilitiesAvg =
		formFilter.reduce((total, form) => total + form.comment.facilities, 0) /
		formFilter.length;
	countComments = formFilter.length;
	return {
		...hotel,
		ratingAvg,
		cleanlinessAvg,
		serviceAvg,
		comfortableAvg,
		facilitiesAvg,
		countComments,
		countForms,
	};
}

async function getHotelsByRateAvg(hotel: any) {
	const forms = await FormSchema.find({ hotelId: { $in: hotel!._id } });
	if (forms.length === 0) {
		return { ...hotel };
	}
	const formFilter = forms.filter((form) => form.rating);
	if (formFilter.length === 0) {
		return { ...hotel };
	}
	const countComments = formFilter.length;
	const ratingAvg =
		formFilter.reduce((total, form) => total + form.rating, 0) /
		formFilter.length;
	return { ...hotel, ratingAvg, countComments };
}

export { getHotelsByService, getHotelsByRating, getHotelsByRateAvg };
