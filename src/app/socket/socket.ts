import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NewBookingPricingService } from '../modules/newbookingpricing/newbookingpricing.service';

let io: SocketIOServer | null = null;

export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('⚡ Socket client connected:', socket.id);

    // Real-time booking price calculation
    socket.on('calculate_booking_price', async (payload: {
      serviceSlug?: string;
      sqft?: number;
      bedrooms?: number;
      bathrooms?: number;
      selectedAddons?: string[];
    }) => {
      try {
        const result = await NewBookingPricingService.calculateBookingPrice(payload);
        socket.emit('booking_price_result', { success: true, data: result });
      } catch (err: any) {
        socket.emit('booking_price_result', { success: false, message: err.message || 'Calculation failed' });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const emitAddonUpdated = (data?: any) => {
  if (io) {
    io.emit('addon_updated', data || { timestamp: Date.now() });
  }
};

export const emitPricingUpdated = (data?: any) => {
  if (io) {
    io.emit('pricing_updated', data || { timestamp: Date.now() });
  }
};

export const emitServiceUpdated = (data?: any) => {
  if (io) {
    io.emit('service_catalog_updated', data || { timestamp: Date.now() });
  }
};
