import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import ConsultRequestsBox from "../components/ConsultRequestsBox"

function ProvResources() {
    const [files, setFiles] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }))
            )
        }
    })

    const images = files.map((file) => (
        <div key={file.name}>
            <div>
                <img src={file.preview} style={{ width: "50px" }} alt="testDragDrop" />
            </div>
        </div>
    ))
    return (
        <section>
            <Sidebar />
            <div className="main-content patient">
                <Header />
                <main className="provider-dash">
                    <div className="card uploadFileHere me-5 mx-3" {...getRootProps()}>
                        <input {...getInputProps()}></input>
                        <h4>Drop Files Here</h4>
                        <i class=" ULIcon las la-file-upload"></i>
                    </div>
                    <div className="card uploadFileHere UpLC2" {...getRootProps()}>
                        <input {...getInputProps()}></input>
                        <h4>Drop to Send</h4>
                        <i class=" ULIcon las la-file-upload"></i>
                    </div>
                    <div className="recent-grid">
                        <div class="table-responsive">
                            <div className="card uploadedFileDisplay">
                                <h5>Uploaded Files to Send:</h5>
                                {images}
                            </div>
                        </div>
                        <ConsultRequestsBox />
                    </div>
                </main>
            </div>
        </section>




    )
}

export default ProvResources;