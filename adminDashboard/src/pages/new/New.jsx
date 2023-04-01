import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Handles the form for new user input. 

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const navigate = useNavigate()

  // Updates the info state variable as the user inputs data into the form.
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };


  /* When the user clicks the "Send" button. It creates a new user object by
  merging the info state variable and img (if a file was uploaded) using the spread operator. 
  It then makes an HTTP POST request to the server to create a new user. */
  const handleClick = async (e) => {
    e.preventDefault();
    const newUser = { ...info };
  
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");
      /* If an image was uploaded, the file is uploaded to a cloudinary server 
      and updates the newUser.img property with the URL of the uploaded image. */
      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/duq61sgxt/image/upload",
          data
        );
  
        const { url } = uploadRes.data;
        newUser.img = url;
      } catch (err) {
        console.log(err);
      }
    }
     
    try {
      await axios.post("/auth/register", newUser);
    } catch (err) {
      console.log(err);
    }

    navigate("/users")

  };
  // Renders a form with inputs for user information and an input for an image file. 
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
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
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;