import React, { useState, useEffect } from "react";
import iconLogo from "../../Images/TelePsycRXnameWicon500by300.jpg";
import DefaultImg from "../../Images/TelePsycRXicon.jpg";
import axiosInstance from "../../api/TelePsyAPI";

function ProfileBoxPA({
  user,
  setProfileUpdate,
  profileUpdate,
  showLogo,
  enableEdit,
  width,
  height,
}) {
  const [image, setImage] = useState({ preview: "", raw: "" });
  useEffect(() => {
    // const
    axiosInstance
      .get(`accounts/users/${user.id}/`)
      .then((response) => response.data)
      .then(({ image }) =>
        setImage({
          preview: image,
          raw: "",
        })
      );
  }, []);

useEffect(()=>{
  if (image.preview) {
    localStorage.setItem("user", JSON.stringify({...user, image: image.preview}))
    setProfileUpdate(image.preview)
  }
  
}, [image.preview])

  const handleChange = (e) => {
    if (e.target.files.length) {
      // const url = URL.createObjectURL(e.target.files[0]);
      // localStorageHelper.store("profileImage", url);
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      axiosInstance.patch(`accounts/users/${user.id}/`, formData);
      // S3 upload
      setProfileUpdate(!profileUpdate);
    }
  };

  return (
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-md-7">
          <div class=" p-1 ">
            {showLogo ? (
              <img src={iconLogo} alt="TelePsycRX" className="py-4 logo" />
            ) : null}

            <div class="text-center">
              {" "}
              <label htmlFor="upload-button">
                <img
                  src={image.preview || user.image || DefaultImg}
                  width={width || "150"}
                  height={height || "150"}
                  class="rounded-circle"
                  style={{
                    objectFit: "cover",
                    cursor: "cell",
                  }}
                />{" "}
              </label>
              {enableEdit ? (
                <input
                  type="file"
                  accept="image/*"
                  id="upload-button"
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
              ) : null}
            </div>

            <div class="text-center">
              <h4 class="mb-0">{`${user?.first_name} ${user?.last_name}`}</h4>{" "}
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileBoxPA;
