import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { calculateBookingPrice } from '../modules/booking/booking.service';

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
      customFieldValues?: Record<string, any>;
    }) => {
      try {
        const result = await calculateBookingPrice(payload);
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

export const emitBookingCreated = (data?: any) => {
  if (io) {
    io.emit('booking_created', data || { timestamp: Date.now() });
  }
};

export const emitBookingUpdated = (data?: any) => {
  if (io) {
    io.emit('booking_updated', data || { timestamp: Date.now() });
  }
};

export const emitCoverageUpdated = (data?: any) => {
  if (io) {
    io.emit('coverage_updated', data || { timestamp: Date.now() });
  }
};

export const emitTeamUpdated = (data?: any) => {
  if (io) {
    io.emit('team_updated', data || { timestamp: Date.now() });
  }
};

export const emitCleanerUpdated = (data?: any) => {
  if (io) {
    io.emit('cleaner_updated', data || { timestamp: Date.now() });
  }
};

export const emitLeaderRequestUpdated = (data?: any) => {
  if (io) {
    io.emit('leader_request_updated', data || { timestamp: Date.now() });
  }
};

export const emitLeaderAppointmentUpdated = (data?: any) => {
  if (io) {
    io.emit('leader_appointment_updated', data || { timestamp: Date.now() });
  }
};

export const emitCMSUpdated = (data?: any) => {
  if (io) {
    io.emit('cms_updated', data || { page: 'home', timestamp: Date.now() });
  }
};

