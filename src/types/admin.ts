export type AdminPage =
  | 'login'
  | 'forgot-password'
  | 'reset-sent'
  | 'dashboard'
  | 'website-pages'
  | 'news'
  | 'news-editor'
  | 'programmes'
  | 'programme-editor'
  | 'events'
  | 'event-editor'
  | 'event-registrations'
  | 'publications'
  | 'media'
  | 'leadership'
  | 'partners'
  | 'messages'
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
  category: string;
  author: string;
  date: string;
  status: 'draft' | 'published' | 'archived';
  views?: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  status: 'upcoming' | 'ongoing' | 'past';
  registrations: number;
  capacity: number;
}

export interface Programme {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'draft' | 'completed';
  startDate: string;
  endDate: string;
  beneficiaries: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  status: 'unread' | 'read' | 'archived';
  body: string;
}
