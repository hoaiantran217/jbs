import { useEffect, useState } from "react";
import axios from "axios";
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/reviews/public`);
        setReviews(res.data);
      } catch (err) {
        setError("Không thể tải đánh giá");
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  console.log(reviews);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>
        {index < rating ? (
          <StarIcon className="w-5 h-5 text-yellow-400 inline" />
        ) : (
          <StarOutlineIcon className="w-5 h-5 text-yellow-400 inline" />
        )}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải đánh giá...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">Đánh giá từ khách hàng</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những chia sẻ chân thực từ khách hàng đã sử dụng dịch vụ của chúng tôi
          </p>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đánh giá</h3>
            <p className="text-gray-500">Hãy là người đầu tiên đánh giá dịch vụ của chúng tôi!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <div 
                key={review._id} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Avatar and Name */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mr-4">
                    {review.avatar ? (
                      <img 
                        src={review.avatar} 
                        alt={review.reviewerName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-bold">
                        {review.reviewerName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.reviewerName}</h3>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                {/* Date
                <div className="text-sm text-gray-500 text-right">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div> */}
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bạn đã sử dụng dịch vụ của chúng tôi?
            </h2>
            <p className="text-gray-600 mb-6">
              Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ tốt hơn
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all">
              Liên hệ với chúng tôi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 