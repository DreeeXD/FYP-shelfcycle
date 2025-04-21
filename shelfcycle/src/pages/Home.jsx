import { useEffect, useState } from "react";
import SummaryAPI from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '../store/wishlistSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaSearch, FaExchangeAlt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [exchangeBooks, setExchangeBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    setIsLoading(true);
    fetch(SummaryAPI.getBooks.url, {
      method: SummaryAPI.getBooks.method,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.data);
          setExchangeBooks(data.data.filter(book => book.bookType === "exchange"));
        }
      })
      .catch((err) => console.error("Failed to fetch books:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetch(SummaryAPI.getAllReviews.url, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.data.slice(0, 3));
        }
      })
      .catch(err => console.error("Failed to fetch reviews", err));
  }, []);


  const handleSubscribe = async (email) => {
    try {
      const res = await fetch(SummaryAPI.newsletterSubscribe.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) toast.success("Thank you for subscribing!");
      else toast.error(data.message || "Subscription failed.");
    } catch (err) {
      toast.error("Error subscribing to newsletter.");
    }
  };

  return (
    <div className="bg-[#fff8f3] dark:bg-gray-900 text-[#2b1e17] dark:text-white font-sans transition-colors duration-300">
      
      {/* Hero Banner */}
      <section className="w-full overflow-hidden relative">
        <motion.div
          className="w-full h-[500px] bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-800 dark:text-yellow-300 text-center mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Discover Your Next Favorite Book
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-orange-700 dark:text-yellow-200 text-center max-w-2xl mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Buy, sell, and exchange pre-loved books with fellow book enthusiasts
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                className="w-full py-3 px-4 pl-10 rounded-lg border-2 border-orange-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-yellow-500 focus:outline-none dark:bg-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 dark:text-gray-400" />
            </div>
            <button 
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
              onClick={() => navigate(`/search?q=${searchTerm}`)}
            >
              Search
            </button>
          </motion.div>
        </motion.div>
      </section>
      {/* Exchange Books Section */}
      <section className="py-16 px-6 bg-orange-50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <motion.h3
              className="text-3xl font-bold text-green-700 dark:text-green-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Books for Exchange
            </motion.h3>
            <motion.button
              className="text-green-600 dark:text-green-400 font-medium flex items-center hover:underline"
              onClick={() => navigate('/books/exchange')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ x: 5 }}
            >
              View All <FaArrowRight className="ml-1" />
            </motion.button>
          </div>

          {isLoading ? (
            <LoadingGrid />
          ) : (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {exchangeBooks.slice(0, 4).length > 0 ? (
                exchangeBooks
                  .slice(0, 4)
                  .map((book, index) => (
                    <BookCard book={book} index={index} key={book._id} delay={0.2} />
                  ))
              ) : (
                <p className="col-span-full text-center text-gray-600 dark:text-gray-300 text-lg">No books available for exchange at the moment.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Sale Books Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <motion.h3
              className="text-3xl font-bold text-blue-800 dark:text-blue-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Hot Arrivals (For Sale)
            </motion.h3>
            <motion.button
              className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
              onClick={() => navigate('/books/sell')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ x: 5 }}
            >
              View All <FaArrowRight className="ml-1" />
            </motion.button>
          </div>

          {isLoading ? (
            <LoadingGrid />
          ) : (
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {books.filter(book => book.bookType === "sell").slice(0, 4).length > 0 ? (
                books
                  .filter(book => book.bookType === "sell")
                  .slice(0, 4)
                  .map((book, index) => (
                    <BookCard book={book} index={index} key={book._id} />
                  ))
              ) : (
                <p className="col-span-full text-center text-gray-600 dark:text-gray-300 text-lg">No books for sale at the moment.</p>
              )}
            </div>
          )}
        </div>
      </section>

        {/* How It Works */}
        <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-bold mb-12 text-center text-[#2b1e17] dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How ShelfCycle Works
          </motion.h3>
          
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              { 
                step: 1, 
                icon: "📚", 
                title: "List Your Books", 
                text: "Upload photos and details of books you want to sell or exchange." 
              },
              { 
                step: 2, 
                icon: "🔍", 
                title: "Find Books You Love", 
                text: "Browse our collection and discover your next great read." 
              },
              { 
                step: 3, 
                icon: "🤝", 
                title: "Buy, Sell or Exchange", 
                text: "Complete your transaction securely through our platform." 
              }
            ].map((item, index) => (
              <motion.div 
                key={item.step}
                className="bg-orange-50 dark:bg-gray-800 p-8 rounded-2xl relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mt-4">{item.icon}</div>
                <h4 className="font-bold text-xl mb-3">{item.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 border-t border-orange-100 dark:border-gray-700">
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-bold mb-12 text-center text-[#2b1e17] dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose ShelfCycle?
          </motion.h3>
          
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
            <Feature icon="♻️" title="Sustainable Reading" text="Give pre-loved books a new home and reduce waste." />
            <Feature icon="💰" title="Affordable Prices" text="Buy and sell books at fair and friendly prices." />
            <Feature icon="📦" title="Easy Exchange" text="Swap books with others effortlessly and instantly." />
            <Feature icon="📚" title="Vast Selection" text="Thousands of titles across genres from the community." />
          </div>
        </div>
      </section>

      {/* Join Community CTA */}
      <section className="py-20 px-6 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h3 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join Our Book-Loving Community Today
          </motion.h3>
          
          <motion.p 
            className="text-lg mb-10 text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Connect with fellow readers, find rare editions, and give your books a second life.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <button 
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors duration-300"
              onClick={() => navigate('/signup')}
            >
              Sign Up Free
            </button>
            
          </motion.div>
        </div>
      </section>

     
      

      {/* Testimonials (Dynamic) */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-bold mb-12 text-center text-[#2b1e17] dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What Our Community Says
          </motion.h3>

          <div className="grid gap-8 md:grid-cols-3">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <motion.div 
                  key={review._id}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={review.reviewer?.uploadPic || "/placeholder.svg"} 
                      alt={review.reviewer?.username || "User"} 
                      className="w-12 h-12 rounded-full mr-4 border-2 border-orange-300 dark:border-blue-400"
                    />
                    <div>
                      <h4 className="font-bold">{review.reviewer?.username || "User"}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{'★'.repeat(review.rating)}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">&quot;{review.comment}&quot;</p>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No community reviews yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-orange-100 dark:bg-gray-800">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.h3 
            className="text-2xl font-bold mb-4 text-[#2b1e17] dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Stay Updated with New Arrivals
          </motion.h3>

          <motion.p 
            className="text-gray-700 dark:text-gray-300 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Subscribe to our newsletter and be the first to know when new books are added.
          </motion.p>

          <motion.form 
            className="flex flex-col sm:flex-row gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              if (email) handleSubscribe(email);
            }}
          >
            <input 
              type="email" 
              name="email"
              placeholder="Your email address" 
              className="flex-grow py-3 px-4 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <button 
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Subscribe
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}



// BookCard with PropTypes
const BookCard = ({ book, index, delay = 0 }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const navigate = useNavigate();
  console.log("Book condition:", book.bookTitle, "-", book.bookCondition);
  const handleToggleWishlist = async (bookId, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(SummaryAPI.toggleWishlist.url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();
      if (data.success) {
        dispatch(toggleWishlistItem(bookId));
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update wishlist");
      }
    } catch (err) {
      toast.error("Error updating wishlist");
    }
  };

  return (
    <motion.div
      key={book._id}
      className="dark:bg-gray-800 p-5 rounded-2xl shadow-xl hover:shadow-2xl transition transform duration-300 cursor-pointer relative group overflow-hidden"
      onClick={() => navigate(`/book-details/${book._id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
      <img
        src={book.bookImage?.[0] || "/placeholder.svg"}
        alt={book.bookTitle}
        className="h-56 w-full object-contain rounded-xl mb-0 border p-2 transition-transform duration-500 group-hover:scale-105"
      />
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => handleToggleWishlist(book._id, e)}
            className={`p-2 rounded-full ${wishlist.includes(book._id) 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'} 
              transition-colors duration-300`}
          >
            {wishlist.includes(book._id) ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
          </button>
        </div>
        {book.bookType === "exchange" && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Exchange
          </div>
        )}
        {book.bookType === "sell" && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            For Sale
          </div>
        )}
      </div>
      <h4 className="text-lg font-bold mb-1 truncate">{book.bookTitle}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 truncate">{book.bookAuthor}</p>
      {book.bookType === "sell" ? (
        <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">$ {book.bookPrice}</div>
      ) : (
        <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
          <FaExchangeAlt className="mr-1" /> Available for Exchange
        </div>
      )}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
        {book.bookCondition ? book.bookCondition : "Not Available"}
        </span>
        <motion.div 
          className="text-blue-600 dark:text-blue-400 flex items-center text-sm font-medium"
          whileHover={{ x: 5 }}
        >
          View Details <FaArrowRight className="ml-1" size={12} />
        </motion.div>
      </div>
    </motion.div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bookTitle: PropTypes.string.isRequired,
    bookAuthor: PropTypes.string,
    bookCondition: PropTypes.string,
    bookImage: PropTypes.arrayOf(PropTypes.string),
    bookPrice: PropTypes.number,
    bookType: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired,
  delay: PropTypes.number,
};

const Feature = ({ icon, title, text }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-5xl mb-4">{icon}</div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
  </motion.div>
);

Feature.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

const LoadingGrid = () => (
  <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-xl h-80 animate-pulse">
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ))}
  </div>
);
