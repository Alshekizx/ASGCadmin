import type { Article, Programme, Event, Publication, Message, Leader, Partner, Subscriber, Registration, User } from './types';

export const mockArticles: Article[] = [
  { id: '1', title: 'ASGC Hosts Regional Investment Forum in Abuja', summary: 'African Sovereign Growth Capital convened leading investors and policymakers for a two-day summit on sustainable investment in West Africa.', category: 'News', author: 'Communications Team', date: '2025-09-15', status: 'published', tags: ['investment', 'forum', 'west-africa'], featuredImage: 'photo-1573167243872-43c6433b9d40' },
  { id: '2', title: 'New Partnership with African Development Bank Announced', summary: 'ASGC and the African Development Bank have formalised a strategic partnership to advance infrastructure financing across the continent.', category: 'Partnerships', author: 'Ambassador Ahmed Sule', date: '2025-09-10', status: 'published', tags: ['partnership', 'afdb', 'infrastructure'], featuredImage: 'photo-1560472354-b33ff0c44a43' },
  { id: '3', title: 'Policy Brief: Foreign Direct Investment Trends in Sub-Saharan Africa', summary: 'An analysis of FDI inflows across Sub-Saharan Africa over the past decade and recommendations for policy reforms.', category: 'Research', author: 'Policy Team', date: '2025-09-05', status: 'published', tags: ['policy', 'fdi', 'research'], featuredImage: 'photo-1559136555-9303baea8ebd' },
  { id: '4', title: 'ASGC Participates in UN General Assembly Side Events', summary: 'Delegation led by Ambassador Ahmed Sule engages with multilateral partners during UNGA week in New York.', category: 'Diplomacy', author: 'Communications Team', date: '2025-09-02', status: 'published', tags: ['unga', 'diplomacy', 'multilateral'], featuredImage: 'photo-1542744094-3a31f272c490' },
  { id: '5', title: 'Call for Applications: ASGC Leadership Academy 2025 Cohort', summary: 'Applications are now open for the fourth cohort of the ASGC Leadership Academy for emerging African business leaders.', category: 'Programmes', author: 'Programmes Team', date: '2025-08-28', status: 'published', tags: ['academy', 'leadership', 'applications'], featuredImage: 'photo-1523050854058-8df90110c9f1' },
  { id: '6', title: 'Responsible Investment Framework — Draft for Consultation', summary: 'ASGC releases a draft responsible investment framework for stakeholder consultation before final publication.', category: 'Research', author: 'Policy Team', date: '2025-08-20', status: 'draft', tags: ['investment', 'framework', 'consultation'], featuredImage: '' },
];

export const mockProgrammes: Programme[] = [
  { id: '1', title: 'ASGC Leadership Academy', category: 'Capacity Building', status: 'active', startDate: '2025-01-15', endDate: '2025-12-15', beneficiaries: 'Emerging African business and public sector leaders', overview: 'A rigorous nine-month leadership development programme designed to equip emerging African leaders with skills in policy, investment, and organisational leadership.' },
  { id: '2', title: 'Trade & Investment Facilitation Programme', category: 'Economic Development', status: 'active', startDate: '2025-03-01', endDate: '2025-11-30', beneficiaries: 'SMEs and investment promotion agencies', overview: 'Facilitating trade and investment flows between African nations and international partners through structured matchmaking, advisory services, and policy advocacy.' },
  { id: '3', title: 'Policy Dialogue Series', category: 'Policy', status: 'active', startDate: '2025-02-01', endDate: '2025-12-31', beneficiaries: 'Government officials, policymakers, academics', overview: 'A quarterly series of structured policy dialogues bringing together stakeholders to address critical economic and developmental challenges facing Africa.' },
  { id: '4', title: 'Responsible Investment Standards Initiative', category: 'Research', status: 'draft', startDate: '2025-10-01', endDate: '2026-09-30', beneficiaries: 'Institutional investors, development finance institutions', overview: 'Developing and promoting standards for responsible investment in African markets, with a focus on ESG alignment and developmental impact.' },
];

export const mockEvents: Event[] = [
  { id: '1', title: 'ASGC Annual Investment Symposium 2025', date: '2025-10-14', time: '09:00 – 17:00', venue: 'Transcorp Hilton, Abuja, Nigeria', status: 'upcoming', capacity: 250, registered: 187, registrationOpen: true },
  { id: '2', title: 'Africa Trade Policy Dialogue — Lagos', date: '2025-10-28', time: '10:00 – 16:00', venue: 'Eko Hotel & Suites, Lagos, Nigeria', status: 'upcoming', capacity: 150, registered: 94, registrationOpen: true },
  { id: '3', title: 'Leadership Academy Graduation Ceremony', date: '2025-11-18', time: '14:00 – 18:00', venue: 'ASGC Conference Centre, Abuja', status: 'upcoming', capacity: 200, registered: 142, registrationOpen: false },
  { id: '4', title: 'West Africa Investment Roundtable', date: '2025-08-22', time: '09:30 – 15:30', venue: 'Radisson Blu, Accra, Ghana', status: 'past', capacity: 100, registered: 98, registrationOpen: false },
  { id: '5', title: 'Responsible Investment Workshop', date: '2025-07-10', time: '09:00 – 13:00', venue: 'Virtual (Zoom)', status: 'past', capacity: 500, registered: 312, registrationOpen: false },
];

export const mockPublications: Publication[] = [
  { id: '1', title: 'Africa Investment Outlook 2025', type: 'Report', author: 'ASGC Research Team', date: '2025-08-15', status: 'published', category: 'Investment', downloads: 1423 },
  { id: '2', title: 'Responsible Investment Framework — Version 1.0', type: 'Framework', author: 'Policy Team', date: '2025-07-20', status: 'published', category: 'Policy', downloads: 867 },
  { id: '3', title: 'ASGC Annual Report 2024', type: 'Annual Report', author: 'ASGC Secretariat', date: '2025-06-01', status: 'published', category: 'Institutional', downloads: 2104 },
  { id: '4', title: 'Policy Brief: FDI in Sub-Saharan Africa', type: 'Policy Brief', author: 'Dr. Emeka Okafor', date: '2025-05-10', status: 'published', category: 'Research', downloads: 594 },
  { id: '5', title: 'Trade Facilitation Compendium 2025', type: 'Compendium', author: 'Trade Team', date: '2025-09-01', status: 'draft', category: 'Trade', downloads: 0 },
];

export const mockMessages: Message[] = [
  { id: '1', name: 'Dr. Amara Diallo', email: 'a.diallo@ecowas.int', subject: 'Request for Partnership Discussion', date: '2025-09-18', status: 'unread', body: 'Dear ASGC Team,\n\nI am reaching out on behalf of the ECOWAS Commission to explore potential areas of collaboration between our organisations in the field of regional investment promotion.\n\nWould it be possible to arrange a meeting at your earliest convenience?\n\nBest regards,\nDr. Amara Diallo\nDirector, Investment Promotion\nECOWAS Commission', organisation: 'ECOWAS Commission' },
  { id: '2', name: 'James Okonkwo', email: 'j.okonkwo@businessnigeria.com', subject: 'Investment Forum Speaking Opportunity', date: '2025-09-16', status: 'read', body: 'Hello,\n\nWe are organising the Nigeria Business Summit in December and would love to have Ambassador Sule as a keynote speaker. Please let me know if this would be possible.\n\nThank you,\nJames Okonkwo', organisation: 'Business Nigeria' },
  { id: '3', name: 'Ms. Fatimah Al-Hassan', email: 'fatimah.alhassan@gmail.com', subject: 'Leadership Academy Application Inquiry', date: '2025-09-14', status: 'replied', body: 'Good day,\n\nI am interested in applying to the ASGC Leadership Academy. Could you please provide more information about the eligibility criteria and application process?\n\nKind regards,\nFatimah Al-Hassan', organisation: '' },
  { id: '4', name: 'Mr. Emmanuel Asante', email: 'e.asante@afdb.org', subject: 'Follow-up: MoU Signing Arrangements', date: '2025-09-12', status: 'replied', body: 'Dear Ambassador Sule,\n\nFollowing our productive discussions last week, I wanted to follow up on the MoU signing arrangements. Our legal team is ready to proceed when yours is available.\n\nBest,\nEmmanuel Asante', organisation: 'African Development Bank' },
  { id: '5', name: 'Ngozi Adaeze', email: 'ngozi.adaeze@mediagroup.ng', subject: 'Media Accreditation for Investment Symposium', date: '2025-09-11', status: 'unread', body: 'Hello,\n\nI am a journalist with The African Business Review and would like to request media accreditation for the ASGC Annual Investment Symposium in October.\n\nPlease advise on the process.\n\nRegards,\nNgozi Adaeze', organisation: 'African Business Review' },
];

export const mockLeaders: Leader[] = [
  { id: '1', name: 'Ambassador Ahmed Sule', position: 'Founder & Director General', order: 1, status: 'active', biography: 'Ambassador Ahmed Sule is a distinguished diplomat, strategist, and development finance specialist with over three decades of experience spanning international diplomacy, sovereign wealth management, and economic development. He founded African Sovereign Growth Capital (ASGC) to bridge the gap between African economic potential and responsible capital formation.\n\nPrior to founding ASGC, Ambassador Sule served in various senior diplomatic and advisory roles across Africa and internationally, championing frameworks for sustainable investment and African economic integration. His work has focused on positioning Africa as a credible destination for institutional and foreign direct investment.\n\nAmbassador Sule is widely recognised as a thought leader on African development finance, trade facilitation, and responsible investment frameworks. He is a frequent speaker at international forums including the UN General Assembly, African Union summits, and World Economic Forum events.', image: 'photo-1507003211169-0a1dd7228f2d' },
  { id: '2', name: 'Dr. Adaeze Nwosu', position: 'Director, Policy & Research', order: 2, status: 'active', biography: 'Dr. Adaeze Nwosu leads ASGC\'s policy research and advocacy work, bringing extensive experience from development economics and public policy. She holds a doctorate from the London School of Economics and has previously worked with the World Bank and African Development Bank.', image: 'photo-1594824476967-48c8b964273f' },
  { id: '3', name: 'Mr. Kofi Mensah-Bonsu', position: 'Director, Investment Facilitation', order: 3, status: 'active', biography: 'Mr. Kofi Mensah-Bonsu oversees ASGC\'s investment facilitation portfolio, with particular expertise in structuring cross-border transactions and public-private partnerships across West and East Africa.', image: 'photo-1472099645785-5658abf4ff4e' },
  { id: '4', name: 'Ms. Zainab Mohammed', position: 'Head of Communications', order: 4, status: 'active', biography: 'Ms. Zainab Mohammed leads ASGC\'s communications and external relations strategy, ensuring the organisation\'s voice carries authority and clarity across media, public affairs, and stakeholder engagement.', image: 'photo-1580489944761-15a19d654956' },
];

export const mockPartners: Partner[] = [
  { id: '1', name: 'African Development Bank', website: 'https://afdb.org', category: 'Development Finance', status: 'active', order: 1, logo: '' },
  { id: '2', name: 'ECOWAS Commission', website: 'https://ecowas.int', category: 'Regional Body', status: 'active', order: 2, logo: '' },
  { id: '3', name: 'African Union Commission', website: 'https://au.int', category: 'Continental Body', status: 'active', order: 3, logo: '' },
  { id: '4', name: 'United Nations Development Programme', website: 'https://undp.org', category: 'UN Agency', status: 'active', order: 4, logo: '' },
  { id: '5', name: 'International Finance Corporation', website: 'https://ifc.org', category: 'Development Finance', status: 'active', order: 5, logo: '' },
  { id: '6', name: 'African Export-Import Bank', website: 'https://afreximbank.com', category: 'Development Finance', status: 'inactive', order: 6, logo: '' },
];

export const mockSubscribers: Subscriber[] = [
  { id: '1', email: 'info@ecowas.int', date: '2025-01-15', status: 'active' },
  { id: '2', email: 'policy@afdb.org', date: '2025-02-20', status: 'active' },
  { id: '3', email: 'james.o@businessnigeria.com', date: '2025-03-10', status: 'active' },
  { id: '4', email: 'fatimah.ah@gmail.com', date: '2025-03-22', status: 'active' },
  { id: '5', email: 'kofi.m@investghana.gov.gh', date: '2025-04-05', status: 'active' },
  { id: '6', email: 'amara.d@sierraleonemfa.gov', date: '2025-04-18', status: 'active' },
  { id: '7', email: 'newsletter@africabusiness.com', date: '2025-05-02', status: 'unsubscribed' },
  { id: '8', email: 'info@nigeriatrade.gov.ng', date: '2025-05-14', status: 'active' },
];

export const mockRegistrations: Registration[] = [
  { id: '1', eventId: '1', eventTitle: 'ASGC Annual Investment Symposium 2025', name: 'Dr. Emeka Okafor', email: 'e.okafor@unilag.edu.ng', phone: '+234 801 234 5678', organisation: 'University of Lagos', date: '2025-09-10', status: 'confirmed' },
  { id: '2', eventId: '1', eventTitle: 'ASGC Annual Investment Symposium 2025', name: 'Ms. Blessing Adeola', email: 'b.adeola@cbnafrica.ng', phone: '+234 805 678 9012', organisation: 'CBN Africa', date: '2025-09-11', status: 'confirmed' },
  { id: '3', eventId: '1', eventTitle: 'ASGC Annual Investment Symposium 2025', name: 'Mr. Kwame Asante', email: 'k.asante@boi.gov.gh', phone: '+233 24 567 8901', organisation: 'Bank of Industry Ghana', date: '2025-09-12', status: 'pending' },
  { id: '4', eventId: '2', eventTitle: 'Africa Trade Policy Dialogue — Lagos', name: 'Dr. Fatima Yusuf', email: 'f.yusuf@nimasa.gov.ng', phone: '+234 812 345 6789', organisation: 'NIMASA', date: '2025-09-13', status: 'confirmed' },
  { id: '5', eventId: '2', eventTitle: 'Africa Trade Policy Dialogue — Lagos', name: 'Mr. Chukwuemeka Nzei', email: 'c.nzei@naccima.ng', phone: '+234 803 456 7890', organisation: 'NACCIMA', date: '2025-09-14', status: 'cancelled' },
];

export const mockUsers: User[] = [
  { id: '1', name: 'Administrator', email: 'admin@asgc.org', role: 'super-admin', status: 'active', lastLogin: '2025-09-18' },
  { id: '2', name: 'Zainab Mohammed', email: 'z.mohammed@asgc.org', role: 'admin', status: 'active', lastLogin: '2025-09-17' },
  { id: '3', name: 'Content Manager', email: 'content@asgc.org', role: 'content-manager', status: 'active', lastLogin: '2025-09-16' },
  { id: '4', name: 'Programmes Officer', email: 'programmes@asgc.org', role: 'content-manager', status: 'inactive', lastLogin: '2025-08-30' },
];
