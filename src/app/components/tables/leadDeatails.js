import {
  User,
  Phone,
  Mail,
  Building,
  Calendar,
  Globe,
  MapPin,
  Briefcase,
  Bell,
} from "lucide-react";
import LeadTimeline from "../charts/leadTimeline";
import { formatDateToShow } from "../../../utils/utility";

export default function LeadDetails() {
    const data = {
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
        reminder: {
          reminderTime: "2025-02-05T14:00:00Z",
          message: "Follow-up on event",
          reminderStatus: "active",
        },
        // Adding stageChangeHistory property with color
        stageChangeHistory: [
          {
            stage: "Prospecting",
            changedAt: "2025-01-20T09:30:00Z",
            changedBy: "Alice",
            reason: "Initial contact made",
            colour: "#3B82F6"  // Colour from Stages array
          },
          {
            stage: "Qualification",
            changedAt: "2025-01-22T11:00:00Z",
            changedBy: "Bob",
            reason: "Lead qualified",
            colour: "#10B981"  // Colour from Stages array
          },
          {
            stage: "NeedsAnalysis",
            changedAt: "2025-01-24T13:30:00Z",
            changedBy: "Charlie",
            reason: "Needs analysis completed",
            colour: "#14B8A6"  // Colour from Stages array
          },
          {
            stage: "ProposalSent",
            changedAt: "2025-01-26T15:00:00Z",
            changedBy: "David",
            reason: "Proposal sent to the lead",
            colour: "#F59E0B"  // Colour from Stages array
          },
          {
            stage: "Lost",
            changedAt: "2025-01-26T15:00:00Z",
            changedBy: "David",
            reason: "Proposal sent to the lead",
            colour: "#EF4444"  // Colour from Stages array
          },
          {
            stage: "Lost",
            changedAt: "2025-01-26T15:00:00Z",
            changedBy: "David",
            reason: "Proposal sent to the lead",
            colour: "#EF4444"  // Colour from Stages array
          },
          {
            stage: "Lost",
            changedAt: "2025-01-26T15:00:00Z",
            changedBy: "David",
            reason: "Proposal sent to the lead",
            colour: "#EF4444"  // Colour from Stages array
          }
          ,
          {
            stage: "Lost",
            changedAt: "2025-01-26T15:00:00Z",
            changedBy: "David",
            reason: "Proposal sent to the lead",
            colour: "#EF4444"  // Colour from Stages array
          },{
            stage: "Lost",
            changedAt: "2025-01-26T15:00:00Z",
            changedBy: "David",
            reason: "Proposal sent to the lead",
            colour: "#EF4444"  // Colour from Stages array
          },
          {
            stage: "Lost",
            changedAt: "2025-01-26T15:00:00Z",
            changedBy: "David",
            reason: "Proposal sent to the lead",
            colour: "#EF4444"  // Colour from Stages array
          }
          ,
          {
            stage: "Lost",
            changedAt: "2025-01-26T15:00:00Z",
            changedBy: "David",
            reason: "Proposal sent to the lead",
            colour: "#EF4444"  // Colour from Stages array
          }
        ]
      };
      

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className=" max-h-[90vh] ">
      <div className="flex w-full gap-2 text-sm py-4 pl-4 max-md:flex-col ">
        <div className="max-md:w-1/2 sm:w-full space-y-6  ">
          {/* Personal Information */}
          <div className="space-y-3 ">
            <h3 className="text-xl text-gray-900 mb-5">{data.name}</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex gap-2 items-center text-gray-600">
                <Phone size={16} />
                <span>Phone</span>
              </div>
              <p className="text-gray-900">{data.number}</p>
              <div className="flex gap-2 items-center text-gray-600">
                <Phone size={16} />
                <span>Second Phone</span>
              </div>
              <p className="text-gray-900">{data.number}</p>

              <div className="flex gap-2 items-center text-gray-600">
                <Mail size={16} />
                <span>Email</span>
              </div>
              <p className="text-gray-900">{data.email}</p>

              <div className="flex gap-2 items-center text-gray-600">
                <MapPin size={16} />
                <span>Address</span>
              </div>
              <p className="text-gray-900">{data.address}</p>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-3">
            <h3 className="text-sm text-gray-900 mb-2">Collaborators</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex gap-2 items-center text-gray-600">
                <Building size={16} />
                <span>Head Collaborator</span>
              </div>
              <p className="text-gray-900">{data.company}</p>

              <div className="flex gap-2 items-center text-gray-600">
                <Briefcase size={16} />
                <span>Collborators</span>
              </div>
              <p className="text-gray-900">{data.jobTitle}</p>
            </div>
          </div>

          {/* Follow-up Information */}

          <div className="space-y-3">
            <h3 className="text-sm text-gray-900 mb-2">Follow-up Details</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex gap-2 items-center text-gray-600">
                <Calendar size={16} />
                <span>Next Follow-up</span>
              </div>
              <p className="text-gray-900">{"2020"}</p>

             
            </div>
          </div>
          <div className=" rounded-lg">
            <h3 className="text-sm text-gray-900 mb-3">
              Additional Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex gap-2 items-center text-gray-600">
                <Briefcase size={16} />
                <span>Lead Source</span>
              </div>
              <div className="text-gray-900">{data.leadSource}</div>

              <div className={"flex gap-2 items-center text-gray-600"}>
                <Briefcase size={16} />
                <span>Status</span>
              </div>

              <div
                className={
                  "capitalize px-2 py-1 rounded-full w-20 text-center " +
                  ` ${
                    data.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`
                }
              >
                {data.status}
              </div>

              <div className="flex gap-2 items-center text-gray-900">
                <Briefcase size={16} />
                <span>Last Contact</span>
              </div>
              <div className="text-gray-900">
                {/* {formatDate(data.lastContactTime)} */}
              </div>
            </div>
          </div>

          <div className="">
            <h3 className="text-sm text-gray-500 mb-3">Notes</h3>
            <p className="text-gray-700">{data.notes}</p>
          </div>
        </div>
        <div className="max-md:w-1/2 sm:w-full space-y-6 max-md:px-0 px-5 ">
         <LeadTimeline data={data.stageChangeHistory}/>
        </div>
      </div>
    </div>
  );
}
