import React, { useState, useRef } from "react";
import { PlusIcon } from '../../../../assets/svg';
import "./style.css";
import BookCreateModal from "../../book_page/BookCreateModal";

interface AddBookProps {
  onFileSelect: (file: any, newId: number, coverImage: string) => void;
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
  sectionId: string | number;
  globalLoading: number;
  setGlobalLoading: (value: React.SetStateAction<number>) => void;
  setLoading: (isLoading: boolean) => void;
}

export const AddBook: React.FC<AddBookProps> = ({
  onFileSelect,
  setIsModalOpen,
  sectionId,
  globalLoading,
  setGlobalLoading,
  setLoading,
}) => {
    //const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<any>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file && file.type === "application/pdf") {
        try {
          const formData = new FormData();
          console.log("section_id", sectionId)
          formData.append("file", file);
          formData.append("section_id", String(sectionId));

          setGlobalLoading(prev => prev + 1);
          setLoading(true);
          // const response = await client.post("api/book/", formData, {
          //   headers: {
          //     "Content-Type": "multipart/form-data",
          //   },
          // });

          // if (response.data.error === 0) {
          //   console.log("File uploaded successfully", response.data.cover_image);
          //   onFileSelect(file, response.data.book_id, response.data.cover_image);
          // } else if (response.data.error === 2) {
          //   setGlobalLoading(prev => Math.max(prev - 1, 0));
          //   console.error("Limit exceeded: ", response.data.details);
          //   alert("Limit exceeded");
          // } else {
          //   setGlobalLoading(prev => Math.max(prev - 1, 0));
          //   console.error("Failed to upload the file: ", response.data.details);
          //   alert("Failed to upload the file");
          // }
          console.log("File uploaded successfully");
        } catch (error) {
          setGlobalLoading(prev => Math.max(prev - 1, 0));
          console.error("Error during the API call", error);
          alert("Error during the API call");
        }
      } else {
        setGlobalLoading(prev => Math.max(prev - 1, 0));
        console.error("Invalid file type. Please choose a PDF file.");
        alert("Invalid file type. Please choose a PDF file.");
      }
    };
  
    const handleAddBook = () => {
      // if (!(globalLoading > 0) && fileInputRef.current) {
      //   fileInputRef.current.value = null;
      //   fileInputRef.current.click();
      // }
      setIsModalOpen(true);
    };

    return (
      <div className="vertical-container add-book" onClick={handleAddBook}>
        <div className="vertical-rectangle add-book-rectangle">
          <PlusIcon className="plus-icon" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf"
        />

        {/* <BookCreateModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedSection={{name: 'Artificial Intelligence'}}
          setSelectedSection={() => {}}
          sections={[]}
          disabled={true}
          onSubmit={(filename) => {
            console.log("Uploading", filename, "to section", "Artificial Intelligence");
            setLoading(true);
          }}
        /> */}
      </div>
    );
};
