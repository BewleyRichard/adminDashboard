import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Handles the form for creating a new hotel. 

const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate()

 // Fetches data about the available rooms from the server.
  const { data, loading, error } = useFetch("/rooms");
  // Updates the info state variable whenever a form field changes.
  const handleChange = (e) => {

    if (e.target.id === "cheapestPrice") {
      const cheapestPrice = parseFloat(e.target.value); // convert to float
      setInfo((prev) => ({ ...prev, cheapestPrice })); // update state
    } else {
      setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

  };
  // Updates the rooms state variable whenever the user selects one or more rooms from a dropdown list.
  const handleSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRooms(value);
  };
  // Handles submission of info and uploads images to cloudinary. 
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let list = [];
      if (files) {
        list = await Promise.all(
          Object.values(files).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "upload");
            const uploadRes = await axios.post(
              "https://api.cloudinary.com/v1_1/duq61sgxt/image/upload",
              data
            );
            const { url } = uploadRes.data;
            return url;
          })
        );
      }
      // Creates a new hotel object. 
      const newhotel = {
        ...info,
        rooms,
        photos: list,
      };
      console.log(newhotel)

      // Posts the new hotel to the server. 
      await axios.post("/hotels", newhotel);
      navigate("/hotels");
    } catch (err) {
      console.log(err);
    }
    // Navigates back to hotel datatable. 
    navigate("/hotels")


  };
  
  // Renders input form, and previews an image if present. 
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectRooms">
                <label>Rooms</label>
                <select id="rooms" multiple onChange={handleSelect}>
                  {loading
                    ? "loading"
                    : data &&
                      data.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.title}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;