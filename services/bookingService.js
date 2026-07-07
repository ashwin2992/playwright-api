class BookingService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async createBooking(payload, options = {}) {
    return this.apiClient.post('/booking', payload, options);
  }

  async getBooking(bookingId, options = {}) {
    return this.apiClient.get(`/booking/${bookingId}`, options);
  }

  async searchBookings(params = {}, options = {}) {
    return this.apiClient.get('/booking', { ...options, params });
  }

  async updateBooking(bookingId, payload, token, options = {}) {
    return this.apiClient.put(`/booking/${bookingId}`, payload, this.withAuth(token, options));
  }

  async partialUpdateBooking(bookingId, payload, token, options = {}) {
    return this.apiClient.patch(`/booking/${bookingId}`, payload, this.withAuth(token, options));
  }

  async deleteBooking(bookingId, token, options = {}) {
    return this.apiClient.delete(`/booking/${bookingId}`, this.withAuth(token, options));
  }

  async createToken(credentials, options = {}) {
    return this.apiClient.post('/auth', credentials, options);
  }

  withAuth(token, options = {}) {
    return {
      ...options,
      headers: {
        ...(options.headers || {}),
        Cookie: `token=${token}`,
        'Content-Type': 'application/json'
      }
    };
  }
}

module.exports = BookingService;
