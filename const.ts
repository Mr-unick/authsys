/**
 * Application-wide constants.
 *
 * Secrets have been moved to .env.local — see src/config/env.ts for typed access.
 * Permissions and Gates have been moved to src/config/constants.ts (single source of truth).
 * Sample/mock data remains here for development convenience only.
 */

// Re-export from config (backward compatibility)
export { permissions, Gates } from './src/config/constants';
export { env } from './src/config/env';

export const ROOT_URL = "/";
export const ROOT_URL2 = "http://localhost:3000";

// ---------- Chart Data ----------

export const chartDataYear = [
  { column: "January", desktop: { value: 186, color: "#2563eb" }, mobile: { value: 100, color: "#8884d8" } },
  { column: "February", desktop: { value: 305, color: "#2563eb" }, mobile: { value: 120, color: "#8884d8" } },
  { column: "March", desktop: { value: 237, color: "#2563eb" }, mobile: { value: 95, color: "#8884d8" } },
  { column: "April", desktop: { value: 73, color: "#2563eb" }, mobile: { value: 60, color: "#8884d8" } },
  { column: "May", desktop: { value: 209, color: "#2563eb" }, mobile: { value: 140, color: "#8884d8" } },
  { column: "June", desktop: { value: 214, color: "#2563eb" }, mobile: { value: 130, color: "#8884d8" } },
  { column: "July", desktop: { value: 174, color: "#2563eb" }, mobile: { value: 110, color: "#8884d8" } },
  { column: "August", desktop: { value: 114, color: "#2563eb" }, mobile: { value: 80, color: "#8884d8" } },
  { column: "September", desktop: { value: 154, color: "#2563eb" }, mobile: { value: 90, color: "#8884d8" } },
  { column: "October", desktop: { value: 190, color: "#2563eb" }, mobile: { value: 105, color: "#8884d8" } },
  { column: "November", desktop: { value: 24, color: "#2563eb" }, mobile: { value: 20, color: "#8884d8" } },
  { column: "December", desktop: { value: 214, color: "#2563eb" }, mobile: { value: 150, color: "#8884d8" } },
];

export const chartDataMonth = [
  { column: "Sam", assigned: { value: 186, color: "#2563eb" }, conversions: { value: 80, color: "#8884d8" } },
  { column: "John", assigned: { value: 86, color: "#2563eb" }, conversions: { value: 20, color: "#8884d8" } },
  { column: "Jane", assigned: { value: 20, color: "#2563eb" }, conversions: { value: 8, color: "#8884d8" } },
  { column: "Nick", assigned: { value: 126, color: "#2563eb" }, conversions: { value: 100, color: "#8884d8" } },
  { column: "Peter", assigned: { value: 86, color: "#2563eb" }, conversions: { value: 30, color: "#8884d8" } },
];

export const Stages = [
  { stage: "Prospecting", colour: "#3B82F6" },
  { stage: "Qualification", colour: "#10B981" },
  { stage: "NeedsAnalysis", colour: "#14B8A6" },
  { stage: "ProposalSent", colour: "#F59E0B" },
  { stage: "Negotiation", colour: "#FB923C" },
  { stage: "ClosedWon", colour: "#8B5CF6" },
  { stage: "ClosedLost", colour: "#EF4444" },
  { stage: "FollowUp", colour: "#6B7280" },
];

// ---------- Sample / Mock Data (development only) ----------

export const SampleLeads = [
  { id: "1", name: "John Doe", number: "+1234567890", messageCount: 42, hasReminder: true, status: "active", lastContactTime: "2025-01-28T14:35:00Z" },
  { id: "12346", name: "Jane Smith", number: "+1987654321", messageCount: 15, hasReminder: false, status: "inactive", lastContactTime: "2025-01-22T11:20:00Z" },
  { id: "12347", name: "Michael Johnson", number: "+1122334455", messageCount: 5, hasReminder: true, status: "active", lastContactTime: "2025-01-25T09:10:00Z" },
  { id: "12348", name: "Emily Davis", number: "+1444556677", messageCount: 30, hasReminder: true, status: "active", lastContactTime: "2025-01-27T08:05:00Z" },
  { id: "12349", name: "David Wilson", number: "+1777888999", messageCount: 12, hasReminder: false, status: "inactive", lastContactTime: "2025-01-18T17:50:00Z" },
  { id: "12350", name: "Sarah Miller", number: "+1002003004", messageCount: 48, hasReminder: true, status: "active", lastContactTime: "2025-01-30T13:25:00Z" },
  { id: "12351", name: "James Brown", number: "+1567894321", messageCount: 3, hasReminder: false, status: "inactive", lastContactTime: "2025-01-20T12:15:00Z" },
  { id: "12352", name: "Olivia Garcia", number: "+1678990321", messageCount: 20, hasReminder: true, status: "active", lastContactTime: "2025-01-26T10:40:00Z" },
  { id: "12353", name: "William Martinez", number: "+1789203847", messageCount: 8, hasReminder: false, status: "inactive", lastContactTime: "2025-01-24T19:00:00Z" },
  { id: "12354", name: "Sophia Anderson", number: "+1987123456", messageCount: 25, hasReminder: true, status: "active", lastContactTime: "2025-01-29T16:00:00Z" },
];

export const leadDetailSample = {
  id: "12345",
  name: "John Doe",
  number: "+1234567890",
  messageCount: 42,
  hasReminder: true,
  status: "active",
  lastContactTime: "2025-01-28T14:35:00Z",
  email: "johndoe@example.com",
  address: "123 Main St, Springfield, IL",
  dateOfBirth: "1990-05-15",
  preferredContactMethod: "email",
  company: "Doe Enterprises",
  jobTitle: "Marketing Manager",
  language: "English",
  leadSource: "Website",
  lastMessageSent: "2025-01-25T10:15:00Z",
  nextFollowUp: "2025-02-10T09:00:00Z",
  notes: "Interested in new product launch, follow up after event",
  isVIP: true,
  reminder: "2025-02-05T14:00:00Z",
};

export const userData = [
  { id: 1, username: 'johndoe', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'john@example.com', assignedLeads: 24, conversionPercentage: 33 },
  { id: 2, username: 'janesmith', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'jane@example.com', assignedLeads: 36, conversionPercentage: 42 },
  { id: 3, username: 'mikebrown', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'mike@example.com', assignedLeads: 18, conversionPercentage: 33 },
  { id: 4, username: 'sarahlee', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'sarah@example.com', assignedLeads: 42, conversionPercentage: 50 },
  { id: 5, username: 'davidwang', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'david@example.com', assignedLeads: 31, conversionPercentage: 39 },
  { id: 6, username: 'emilyjones', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'emily@example.com', assignedLeads: 27, conversionPercentage: 33 },
  { id: 7, username: 'alexnguyen', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'alex@example.com', assignedLeads: 33, conversionPercentage: 42 },
  { id: 8, username: 'lisapark', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'lisa@example.com', assignedLeads: 19, conversionPercentage: 37 },
  { id: 9, username: 'ryankim', profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'ryan@example.com', assignedLeads: 29, conversionPercentage: 38 },
];

export const Comments = [
  {
    id: 1,
    user: "John Doe",
    timestamp: "2025-03-27T12:30:00Z",
    text: "This is a great post! I really enjoyed reading it.",
    attachment: {
      type: "image",
      preview: "https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg",
    },
  },
  {
    id: 2,
    user: "Jane Smith",
    timestamp: "2025-03-26T14:45:00Z",
    text: "I have some feedback on this topic. Let me know when you're available.",
    attachment: {
      type: "file",
      file: {
        name: "document.pdf",
        url: "https://portal.abuad.edu.ng/lecturer/documents/1554208765DATA_AND_INFORMATION.pdf",
      },
    },
  },
  {
    id: 3,
    user: "Mark Johnson",
    timestamp: "2025-03-25T09:10:00Z",
    text: "Interesting perspective! Thanks for sharing.",
    attachment: null,
  },
];
