export type AdminView =
  | 'login' | 'forgot-password' | 'reset-password'
  | 'dashboard'
  | 'pages'
  | 'news' | 'news-editor'
  | 'programmes' | 'programme-editor'
  | 'events' | 'event-editor' | 'event-registrations'
  | 'publications' | 'publication-editor'
  | 'media'
  | 'leadership' | 'leadership-editor'
  | 'partners'
  | 'messages' | 'message-detail'
  | 'registrations'
  | 'newsletter'
  | 'users'
  | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'content-manager';
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  date: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  tags: string[];
}

export interface Programme {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'draft' | 'completed';
  startDate: string;
  endDate: string;
  beneficiaries: string;
  overview: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'ongoing' | 'past' | 'draft';
  capacity: number;
  registered: number;
  registrationOpen: boolean;
}

export interface Publication {
  id: string;
  title: string;
  type: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'archived';
  category: string;
  downloads: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  body: string;
  organisation?: string;
}

export interface Leader {
  id: string;
  name: string;
  position: string;
  order: number;
  status: 'active' | 'inactive';
  biography: string;
  image?: string;
}

export interface Partner {
  id: string;
  name: string;
  website: string;
  category: string;
  status: 'active' | 'inactive';
  order: number;
  logo?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
  status: 'active' | 'unsubscribed';
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}
