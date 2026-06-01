import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { MediaContext, MediaProvider } from './MediaContext';

// 1. Create a dummy component to interact with the Context
const DummyComponent = () => {
  const { mediaItems, addMedia, updateMedia, updateMediaStatus, deleteMedia } = useContext(MediaContext);

  return (
    <div>
      <div data-testid="item-count">{mediaItems.length}</div>
      <div data-testid="first-item-title">{mediaItems[0]?.title}</div>
      
      {/* Buttons to trigger our CRUD operations */}
      <button onClick={() => addMedia({ title: 'New Test Movie', type: 'Movie', rating: 4 })}>
        Create
      </button>
      <button onClick={() => updateMedia({ ...mediaItems[0], title: 'Updated Title' })}>
        Update
      </button>
      <button onClick={() => updateMediaStatus(mediaItems[0].id, true)}>
        Mark Watched
      </button>
      <button onClick={() => deleteMedia(mediaItems[0].id)}>
        Delete
      </button>
    </div>
  );
};

const renderWithAuth = () => render(
  <AuthContext.Provider value={{ token: 'test-token' }}>
    <MediaProvider>
      <DummyComponent />
    </MediaProvider>
  </AuthContext.Provider>
);

// 2. The Test Suite
describe('MediaContext CRUD Operations', () => {
  beforeEach(() => {
    global.fetch = vi.fn((url, options = {}) => {
      if (!options.method || options.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ id: 1, title: 'Dirty Dancing', type: 'Movie', rating: 5 }]
          })
        });
      }

      if (options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 2,
            ...JSON.parse(options.body)
          })
        });
      }

      if (options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(JSON.parse(options.body))
        });
      }

      if (options.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 1,
            title: 'Dirty Dancing',
            type: 'Movie',
            rating: 5,
            userStatus: 'Watched',
            isCompleted: true,
          })
        });
      }

      if (options.method === 'DELETE') {
        return Promise.resolve({ ok: true });
      }

      return Promise.reject(new Error(`Unhandled request: ${url}`));
    });
  });

  it('READ: Should provide initial API data', async () => {
    renderWithAuth();
    
    await waitFor(() => expect(screen.getByTestId('item-count')).toHaveTextContent('1'));
    expect(screen.getByTestId('first-item-title')).toHaveTextContent('Dirty Dancing');
  });

  it('CREATE: Should add a new item to the state after the API succeeds', async () => {
    renderWithAuth();
    
    await waitFor(() => expect(screen.getByTestId('item-count')).toHaveTextContent('1'));
    const initialCount = parseInt(screen.getByTestId('item-count').textContent);
    
    fireEvent.click(screen.getByText('Create'));
    
    await waitFor(() => {
      const newCount = parseInt(screen.getByTestId('item-count').textContent);
      expect(newCount).toBe(initialCount + 1);
    });
  });

  it('UPDATE: Should modify an existing item after the API succeeds', async () => {
    renderWithAuth();
    
    await waitFor(() => expect(screen.getByTestId('first-item-title')).toHaveTextContent('Dirty Dancing'));
    fireEvent.click(screen.getByText('Update'));
    
    await waitFor(() => expect(screen.getByTestId('first-item-title')).toHaveTextContent('Updated Title'));
  });

  it('STATUS: Should update the current user media status after the API succeeds', async () => {
    renderWithAuth();

    await waitFor(() => expect(screen.getByTestId('first-item-title')).toHaveTextContent('Dirty Dancing'));
    fireEvent.click(screen.getByText('Mark Watched'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/media/1/status'),
      expect.objectContaining({ method: 'PATCH' })
    ));
  });

  it('DELETE: Should remove an item after the API succeeds', async () => {
    renderWithAuth();
    
    await waitFor(() => expect(screen.getByTestId('item-count')).toHaveTextContent('1'));
    const initialCount = parseInt(screen.getByTestId('item-count').textContent);
    
    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      const newCount = parseInt(screen.getByTestId('item-count').textContent);
      expect(newCount).toBe(initialCount - 1);
    });
  });
});
