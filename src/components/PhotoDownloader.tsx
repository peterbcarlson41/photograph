"use client";
import { Photo } from "@/models/Photo";
import React, { useReducer, useState } from "react";
import Check from "./Check";
import { downloadImage } from "@/lib/downloadImage";

type PhotoDownloaderProps = {
  photo: Photo;
};

function PhotoDownloader({ photo }: PhotoDownloaderProps) {
  const src = `/.netlify/images?url=${photo.src.original}&fit=cover&position=center`;

  const { width: originalWidth, height: originalHeight } = photo;

  const aspectRatio = originalWidth / originalHeight;

  const smallWidth = 640;
  const smallHeight = Math.ceil(smallWidth / aspectRatio);
  const mediumWidth = 1280;
  const mediumHeight = Math.ceil(mediumWidth / aspectRatio);
  const largeWidth = 1920;
  const largeHeight = Math.ceil(largeWidth / aspectRatio);

  const menuItems = [
    { label: "Original", width: originalWidth, height: originalHeight },
    { label: "Large", width: largeWidth, height: largeHeight },
    { label: "Medium", width: mediumWidth, height: mediumHeight },
    { label: "Small", width: smallWidth, height: smallHeight },
  ];

  const [state, dispatch] = useReducer(
    (
      state: { width: number; height: number },
      action: { type: "width_changed" | "height_changed"; payload: number }
    ) => {
      switch (action.type) {
        case "width_changed":
          return {
            width: action.payload,
            height: Math.ceil(action.payload / aspectRatio),
          };
        case "height_changed":
          return {
            width: Math.ceil(action.payload * aspectRatio),
            height: action.payload,
          };
        default:
          return state;
      }
    },
    { width: originalWidth, height: originalHeight }
  );
  const [selectedOption, setSelectedOption] = useState(1);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    // Prevent multiple downloads
    if (!downloading) {
      // Set downloading state to true
      setDownloading(true);

      // Actual download logic using Fetch API
      let url = `${src}`;
      let filename = photo.alt.trim().replaceAll(" ", "-");
      if (selectedOption === 0) {
        url = photo.src.original;
      } else if (selectedOption === 1) {
        url += `&w=${largeWidth}`;
        filename += `-${largeWidth}x${largeHeight}`;
      } else if (selectedOption === 2) {
        url += `&w=${mediumWidth}`;
        filename += `-${mediumWidth}x${mediumHeight}`;
      } else if (selectedOption === 3) {
        url += `&w=${smallWidth}`;
        filename += `-${smallWidth}x${smallHeight}`;
      } else if (selectedOption === 4) {
        url += `&w=${state.width}`;
        filename += `-${state.width}x${state.height}`;
      }

      try {
        await downloadImage(url, filename);
      } catch (e) {
        console.error(e);
      } finally {
        // Reset downloading state to false
        setDownloading(false);
      }
    }
  };

  return (
    <div className="join mx-auto">
      <button
        className="btn btn-primary join-item"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading && <span className="loading loading-spinner"></span>}
        Download
      </button>
      <div className="dropdown dropdown-bottom dropdown-end">
        <button tabIndex={0} className="btn btn-primary join-item">
          ↓
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56"
        >
          {menuItems.map((item, idx) => (
            <li key={item.label}>
              <button onClick={() => setSelectedOption(idx)}>
                {item.label}{" "}
                <span className="text-gray-400 dark:text-gray-500">
                  {item.width}x{item.height}
                </span>
                {selectedOption === idx && <Check />}
              </button>
            </li>
          ))}
          <li onClick={() => setSelectedOption(4)}>
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                Custom {selectedOption === 4 && <Check />}
              </div>
              <div className="flex justify-between w-full gap-2">
                <input
                  type="number"
                  placeholder="Width"
                  className="input input-bordered input-sm w-full max-w-xs"
                  value={state.width}
                  max={originalWidth}
                  min={1}
                  onChange={(e) => {
                    dispatch({
                      type: "width_changed",
                      payload: parseInt(e.target.value),
                    });
                  }}
                />
                <input
                  type="number"
                  placeholder="Height"
                  className="input input-bordered input-sm w-full max-w-xs"
                  value={state.height}
                  max={originalHeight}
                  min={1}
                  onChange={(e) => {
                    dispatch({
                      type: "height_changed",
                      payload: parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
          </li>
          <li>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn btn-primary"
            >
              {downloading && <span className="loading loading-spinner"></span>}
              Download
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PhotoDownloader;
