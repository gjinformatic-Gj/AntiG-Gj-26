export interface Artist {
  name: string;
  subtitle: string;
  image: string;
  badge?: string;
  genre?: string;
}

export interface Venue {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  area: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  travelMinutes: number;
  rating: number;
  reviewsCount: number;
  artist: Artist;
  curfew: string;
  curfewTime: string;
  isOvernight: boolean;
  prices: {
    single: number;
    couple: number;
    season: number;
  };
  originalPrice?: number;
  amenities: string[];
  image: string;
  rushLevel: 'Normal' | 'Brisk' | 'Near Capacity';
  passesLeft?: number;
  isOfficial?: boolean;
  isCelebrity?: boolean;
  soldPercent?: number;
  danceSurface: string;
  parkingType: string;
  soundSystem: string;
  gatesOpen: string;
  aartiTime: string;
}

export type ThemeMode = 'terra' | 'glacier';

export interface BookingState {
  venue: Venue;
  passType: 'single' | 'season';
  selectedDate: string;
  counts: {
    female: number;
    male: number;
    couple: number;
  };
  paymentMethod: 'upi' | 'card' | 'netbanking';
  attendeeName: string;
  attendeePhone: string;
}

export interface ConfirmedTicket {
  ticketId: string;
  venueId: string;
  venueName: string;
  venueLocation: string;
  attendeeName: string;
  attendeePhone: string;
  passType: 'single' | 'season';
  selectedDate: string;
  counts: {
    female: number;
    male: number;
    couple: number;
  };
  totalPaid: number;
  transactionId: string;
  paymentMethod: string;
  purchaseDate: string;
  curfewInfo: string;
  qrCodeData: string;
  barcode: string;
  rfidStatus: 'Issued' | 'Dispatched' | 'Active';
}
