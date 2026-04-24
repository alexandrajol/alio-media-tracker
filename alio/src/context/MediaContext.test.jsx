import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React, { useContext } from 'react';
import { MediaContext, MediaProvider } from './MediaContext';

// 1. Create a dummy component to interact with the Context
const DummyComponent = () => {
  const { mediaItems, addMedia, updateMedia, deleteMedia } = useContext(MediaContext);

  return (
    <div>
      <div data-testid="item-count">{mediaItems.length}</div>
      <div data-testid="first-item-title">{mediaItems[0]?.title}</div>
      
      {/* Buttons to trigger our CRUD operations */}
      <button onClick={() => addMedia({ title: 'New Test Movie', type: 'Movie' })}>
        Create
      </button>
      <button onClick={() => updateMedia({ ...mediaItems[0], title: 'Updated Title' })}>
        Update
      </button>
      <button onClick={() => deleteMedia(mediaItems[0].id)}>
        Delete
      </button>
    </div>
  );
};

// 2. The Test Suite
describe('MediaContext CRUD Operations', () => {

  it('READ: Should provide initial mock data', () => {
    render(
      <MediaProvider>
        <DummyComponent />
      </MediaProvider>
    );
    
    // We expect the starting array to have items (15 items based on our mock data)
    const countElement = screen.getByTestId('item-count');
    expect(parseInt(countElement.textContent)).toBeGreaterThan(0);
    expect(screen.getByTestId('first-item-title')).toHaveTextContent('Dirty Dancing');
  });

  it('CREATE: Should add a new item to the RAM state', () => {
    render(
      <MediaProvider>
        <DummyComponent />
      </MediaProvider>
    );
    
    const initialCount = parseInt(screen.getByTestId('item-count').textContent);
    
    // Click the Add button
    fireEvent.click(screen.getByText('Create'));
    
    // The count should go up by 1
    const newCount = parseInt(screen.getByTestId('item-count').textContent);
    expect(newCount).toBe(initialCount + 1);
  });

  it('UPDATE: Should modify an existing item', () => {
    render(
      <MediaProvider>
        <DummyComponent />
      </MediaProvider>
    );
    
    // Click the Update button
    fireEvent.click(screen.getByText('Update'));
    
    // The title of the first item should now be changed
    expect(screen.getByTestId('first-item-title')).toHaveTextContent('Updated Title');
  });

  it('DELETE: Should remove an item from the RAM state', () => {
    render(
      <MediaProvider>
        <DummyComponent />
      </MediaProvider>
    );
    
    const initialCount = parseInt(screen.getByTestId('item-count').textContent);
    
    // Click the Delete button
    fireEvent.click(screen.getByText('Delete'));
    
    // The count should go down by 1
    const newCount = parseInt(screen.getByTestId('item-count').textContent);
    expect(newCount).toBe(initialCount - 1);
  });
});