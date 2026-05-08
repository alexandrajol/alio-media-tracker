import React, { createContext, useState, useEffect } from 'react';

export const MediaContext = createContext();

// This is the address of your new backend!
const API_URL = 'http://localhost:3000/api/media';

export const MediaProvider = ({ children }) => {
  const [mediaItems, setMediaItems] = useState([]);

  // 1. READ (GET all items when the app loads)
  useEffect(() => {
    // We add ?limit=100 so your pagination doesn't accidentally hide items!
    fetch(`${API_URL}?limit=100`) 
      .then(res => res.json())
      .then(data => {
        // Our backend wraps the array in a "data" property because of pagination
        setMediaItems(data.data); 
      })
      .catch(err => console.error("Failed to fetch media from backend:", err));
  }, []);

  // 2. CREATE (POST new item to backend)
  const addMedia = async (newItem) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      
      if (res.ok) {
        const createdItem = await res.json();
        // Update frontend state only AFTER the backend successfully saves it
        setMediaItems([...mediaItems, createdItem]);
      } else {
        const errorData = await res.json();
        console.error("Backend validation failed:", errorData);
      }
    } catch (err) {
      console.error("Failed to connect to backend:", err);
    }
  };

  // 3. UPDATE (PUT changes to backend)
  const updateMedia = async (updatedItem) => {
    try {
      const res = await fetch(`${API_URL}/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });

      if (res.ok) {
        const returnedItem = await res.json();
        setMediaItems(mediaItems.map(item => item.id === returnedItem.id ? returnedItem : item));
      }
    } catch (err) {
      console.error("Failed to update media on backend:", err);
    }
  };

  // 4. DELETE (DELETE from backend)
  const deleteMedia = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMediaItems(mediaItems.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete media on backend:", err);
    }
  };

  return (
    <MediaContext.Provider value={{ mediaItems, addMedia, updateMedia, deleteMedia }}>
      {children}
    </MediaContext.Provider>
  );
};