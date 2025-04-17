import React, { useEffect, useState } from 'react';
import SummaryAPI from '../common';
import { toast } from 'react-toastify';
import EditBook from '../components/EditBook';
import ConfirmDialog from '../components/ConfirmDialog';
import { RiEditBoxLine, RiDeleteBinLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const UserUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  const fetchMyBooks = async () => {
    try {
      const res = await fetch(SummaryAPI.myUploads.url, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setUploads(data.data);
      else toast.error(data.message || 'Failed to fetch uploads');
    } catch (err) {
      toast.error('Error fetching uploads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setEditModalOpen(true);
  };

  const handleBookUpdated = () => {
    fetchMyBooks();
    setEditModalOpen(false);
  };

  const confirmDelete = (book) => {
    setBookToDelete(book);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${SummaryAPI.deleteBook.url}/${bookToDelete._id}`, {
        method: SummaryAPI.deleteBook.method,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Book deleted successfully!');
        fetchMyBooks();
      } else {
        toast.error(data.message || 'Failed to delete book');
      }
    } catch (err) {
      toast.error('Error deleting book');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setBookToDelete(null);
    }
  };

  const handleStatusChange = async (bookId, status) => {
    try {
      const res = await fetch(`${SummaryAPI.updateBook.url}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: bookId, bookStatus: status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Book status updated!');
        fetchMyBooks();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Error updating book status');
    }
  };

  const sortedBooks = [...uploads].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === 'title-asc') {
      return a.bookTitle.localeCompare(b.bookTitle);
    } else if (sortOption === 'title-desc') {
      return b.bookTitle.localeCompare(a.bookTitle);
    } else if (sortOption === 'price-low') {
      return (a.bookPrice || 0) - (b.bookPrice || 0);
    } else if (sortOption === 'price-high') {
      return (b.bookPrice || 0) - (a.bookPrice || 0);
    }
    return 0;
  });

  return (
    <div className="mt-10 transition-colors duration-300 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">My Uploads</h3>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-sm rounded px-3 py-2 shadow-sm"
        >
          <option value="newest">📅 Date Added (Newest)</option>
          <option value="oldest">📅 Date Added (Oldest)</option>
          <option value="title-asc">🔤 Title (A-Z)</option>
          <option value="title-desc">🔡 Title (Z-A)</option>
          <option value="price-low">💰 Price (Low → High)</option>
          <option value="price-high">💸 Price (High → Low)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading your books...</p>
      ) : sortedBooks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">You haven’t uploaded any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sortedBooks.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border dark:border-gray-700 transition-transform p-4 hover:scale-[1.02]"
            >
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button
                  onClick={() => handleEditClick(book)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md"
                  title="Edit Book"
                >
                  <RiEditBoxLine size={18} />
                </button>
                <button
                  onClick={() => confirmDelete(book)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md"
                  title="Delete Book"
                >
                  <RiDeleteBinLine size={18} />
                </button>
              </div>

              <div className="w-full flex justify-center mt-2">
                <img
                  src={book?.bookImage?.[0] || book.bookImage}
                  alt={book.bookTitle}
                  className="w-44 h-56 object-cover rounded-md border"
                />
              </div>

              <div className="mt-4 px-2 text-center space-y-1">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">{book.bookTitle}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">by {book.bookAuthor}</p>
                <p className={`text-sm font-medium ${book.bookType === 'sell' ? 'text-blue-600' : 'text-yellow-600'}`}>
                  {book.bookType === 'sell' ? `$ ${book.bookPrice}` : 'For Exchange'}
                </p>

                <div className="mt-2">
                  <select
                    value={book.bookStatus === 'sold' ? 'sold' : 'available'}
                    onChange={(e) => handleStatusChange(book._id, e.target.value)}
                    className="text-sm border rounded px-2 py-1 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {editModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <EditBook
            onClose={() => setEditModalOpen(false)}
            bookData={selectedBook}
            onBookUpdated={handleBookUpdated}
          />
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          title="Delete Confirmation"
          message={`Are you sure you want to delete "${bookToDelete?.bookTitle}"?`}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmDelete}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default UserUploads;
