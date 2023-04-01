import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


// Create hotel controller function. 
export const createHotel = async (req,res,next) => {
    // Store hotel information based on user entry.
    const newHotel = new Hotel(req.body)
    
    try{
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    }catch(err){
        next(err);
    }
};

// Update hotel controller function. 
export const updateHotel = async (req,res,next) => {
    // Update hotel information based on user entry.
    try{
        /* Find hotel by id 
        and update db with the information entered by the user.
        Return the updated doc. */
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedHotel)
    }catch(err){
        next(err);
    }
};

// Delete hotel controller function. 
export const deleteHotel = async (req,res,next) => {
    
    try{
        /* Find hotel by id and delete it.*/
        await Hotel.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json("Hotel has been deleted")
    }catch(err){
        next(err);
    }
};

// Get a hotel controller function. 
export const getHotel = async (req,res,next) => {
    
    try{
        // Find hotel by id return doc from db.
        const hotel = await Hotel.findById(
            req.params.id
        );
        res.status(200).json(hotel)
    }catch(err){
        next(err);
    }
};



// Get all hotels controller function. 
export const getHotels = async (req, res, next) => {
    const { limit, min, max, ...others } = req.query;
    try {
      const hotels = await Hotel.find({
        ...others, cheapestPrice: {$gt:min | 1, $lt:max ||999}
      }).limit(Number(limit)); // pass the `limit` parameter directly as an argument to `limit()`
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };
  

export const countByCity = async (req,res,next) => {
    const cities = req.query.cities.split(",")
    try{
        const list = await Promise.all(cities.map(city=>{
            return Hotel.countDocuments({city:city})
        }))
        res.status(200).json(list);
    }catch(err){
        next(err)
    }
};

/* Uses Mongoose to count the number of documents in a "Hotel" collection with a specific type. 
The function counts the number of hotels, apartments, resorts, villas, and cabins separately, 
and returns a JSON response with the type of the property and the count of each property type. */
export const countByType = async (req, res, next) => {
    try {
      const hotelCount = await Hotel.countDocuments({ type: "hotel" });
      const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
      const resortCount = await Hotel.countDocuments({ type: "resort" });
      const villaCount = await Hotel.countDocuments({ type: "villa" });
      const cabinCount = await Hotel.countDocuments({ type: "cabin" });
  
      res.status(200).json([
        { type: "hotel", count: hotelCount },
        { type: "apartments", count: apartmentCount },
        { type: "resorts", count: resortCount },
        { type: "villas", count: villaCount },
        { type: "cabins", count: cabinCount },
      ]);
    } catch (err) {
      next(err);
    }
};

//comment
export const getHotelRooms = async (req, res, next) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      const list = await Promise.all(
        hotel.rooms.map((room) => {
          return Room.findById(room);
        })
      );
      res.status(200).json(list)
    } catch (err) {
      next(err);
    }
};