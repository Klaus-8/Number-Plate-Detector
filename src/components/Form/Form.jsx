import React, { useState } from "react";
import Tesseract from "tesseract.js";
import emailjs from "@emailjs/browser";

import "./Form.css";

const Form = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const extractText = (image) => {
    Tesseract.recognize(image, "eng", {
      logger: (m) => null,
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        setText(result.data.text);
        setExtracting(false);

        const templateParams = {
          text: result.data.text,
        };

        emailjs
          .send(
            process.env.REACT_APP_EMAIL_SERVICE_ID,
            process.env.REACT_APP_EMAIL_TEMPLATE_ID,
            templateParams,
            process.env.REACT_APP_EMAIL_PUBLIC_KEY
          )
          .then(() => {
            setEmailSent(true);
          })
          .catch((error) => console.error(error));
      });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    setExtracting(true);
    extractText(image);
  };

  const onImageSelection = (event) => {
    const [file] = event.target.files;
    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="form-outer-container">
      <div className="form-inner-container">
        <form onSubmit={submitHandler}>
          <div className="form-input-container">
            <h2>Insert an Image:</h2>
            <input type="file" onChange={onImageSelection} />
          </div>
          <button className="form-button" type="submit">
            Submit
          </button>
        </form>
        {image && <img className="image" src={image} alt={"abc"} />}
        {extracting ? (
          <span className="extract-text">Extracting...</span>
        ) : (
          <>
            {text && (
              <span className="extract-text">
                <strong>Extracted Text</strong>
                {` - ${text}`}
              </span>
            )}
          </>
        )}
        {emailSent && (
          <span>
            Vehicle <strong>e-Challan</strong> Sent!! Please, check your email.
          </span>
        )}
      </div>
    </div>
  );
};

export default Form;
