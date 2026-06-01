import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { API_BASE_URL, getAuthHeaders } from '../utils/api';

export const MediaContext = createContext();

const API_URL = `${API_BASE_URL}/media`;

export const MediaProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [mediaItems, setMediaItems] = useState([]);

  // 1. READ (GET all items when the app loads)
  // 1. READ (GET all items when the app loads)
  useEffect(() => {
    if (!token) {
      setMediaItems([]);
      return;
    }

    fetch(`${API_URL}?limit=100`, {
      headers: getAuthHeaders(token),
    }) 
      .then(res => res.json())
      .then(data => {
        // BULLETPROOF CHECK: Only set it if it's an actual array!
        if (data.data && Array.isArray(data.data)) {
          setMediaItems(data.data); 
        } else {
          // If the backend sends an error, default to an empty array so React doesn't crash
          console.error("Backend sent an error instead of data:", data);
          setMediaItems([]); 
        }
      })
      .catch(err => {
        console.error("Failed to fetch media from backend:", err);
        setMediaItems([]); // Fallback to empty array on network failure
      });
  }, [token]);

  // 2. CREATE (POST new item to backend)
  const addMedia = async (newItem) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(newItem)
      });
      
      if (res.ok) {
        const createdItem = await res.json();
        // Update frontend state only AFTER the backend successfully saves it
        setMediaItems((items) => [...items, createdItem]);
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
        headers: getAuthHeaders(token),
        body: JSON.stringify(updatedItem)
      });

      if (res.ok) {
        const returnedItem = await res.json();
        setMediaItems((items) => items.map(item => item.id === returnedItem.id ? returnedItem : item));
      }
    } catch (err) {
      console.error("Failed to update media on backend:", err);
    }
  };

  const updateMediaStatus = async (id, isCompleted) => {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ isCompleted })
      });

      if (res.ok) {
        const returnedItem = await res.json();
        setMediaItems((items) => items.map(item => item.id === returnedItem.id ? returnedItem : item));
      }
    } catch (err) {
      console.error("Failed to update media status on backend:", err);
    }
  };

  // 4. DELETE (DELETE from backend)
  const deleteMedia = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (res.ok) {
        setMediaItems((items) => items.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete media on backend:", err);
    }
  };

  return (
    <MediaContext.Provider value={{ mediaItems, addMedia, updateMedia, updateMediaStatus, deleteMedia }}>
      {children}
    </MediaContext.Provider>
  );
};
