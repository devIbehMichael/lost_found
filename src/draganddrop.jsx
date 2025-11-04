import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export default function DragAndDropUpload({ onFileSelect }) {
  const [fileName, setFileName] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFileName(file.name);
      onFileSelect(file);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-3xl mx-auto p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
      }`}
    >
      <input {...getInputProps()} />
      {fileName ? (
        <p className="text-gray-700 text-center">
          <strong>{fileName}</strong> selected
        </p>
      ) : isDragActive ? (
        <p className="text-blue-600 text-center">Drop your image here...</p>
      ) : (
        
        <div className='flex flex-col items-center justify-center gap-8 '>
            <p className='font-bold text-xl'>Upload an image of the lost item</p>
            <p className="text-black text-center max-w-lg">
          Drag and drop or click to upload an image of the item you're looking for. Our AI will analyze the image and search for matching items in our database. </p>
          <span className=" text-black bg-gray-200 px-6 py-1.5 rounded-lg font-semibold">Upload Image</span>
        </div>
      )}
    </div>
  );
}
