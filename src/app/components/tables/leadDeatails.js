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
  Edit,
  Plus,
} from "lucide-react";
import LeadTimeline from "../charts/leadTimeline";

import CommentsSection from "./commentsSection";
import Modal from "../modal";
import FormComponent from "../forms/form";
import { ToolTipComponent } from "../tooltip";
import { Button } from "../../../components/components/ui/button";
import { Comments } from "../../../../const";







export default function LeadDetails({ data }) {
  // const data = {
  //   "id": 1,
  //   "name": "Nikhil Lende",
  //   "email": "nikhillende@gmail.com",
  //   "phone": "7448080267",
  //   "secondPhone": "no second number",
  //   "address": "ghatanji",
  //   "city": "Mumbai",
  //   "state": "Maharashtra",
  //   "country": "India",
  //   "pincode": "411001",
  //   "leadStatus": "active",
  //   "leadSource": "Website",
  //   "leadStage": "Prospect",
  //   "notes": "No notes",
  //   "collborators": [],
  //   "stageChangeHistory": [
  //     {
  //       "stage": "Prospect",
  //       "changedAt": "2025-03-28T05:59:55.000Z",
  //       "changedBy": "Nikhil Lende",
  //       "reason": "New Lead",
  //       "colour": "#f70202"
  //     }, {
  //       "stage": "Prospect2",
  //       "changedAt": "2025-03-28T06:36:57.000Z",
  //       "changedBy": "Nikhil Lende",
  //       "reason": "New Lead Added",
  //       "colour": "#1fbde5"
  //     }, 
  //     {
  //       "stage": "Prospect3",
  //       "changedAt": "2025-03-28T06:49:37.000Z",
  //       "changedBy": "Nikhil Lende",
  //       "reason": "New Lead",
  //       "colour": "#c21e1e"
  //     }
  //   ],
  //   "comments": [{
  //     "comment": "Nothing to say",
  //     "user": "Nikhil Lende",
  //     "createdAt": "2025-03-28T06:49:37.000Z"
  //   }]
  // };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(data,'from lead details')

  return (
    <div className="overflow-y-scroll px-2 max-sm:px-0 h-full ">
      <div className="flex w-full gap-2 text-sm py-4 pl-4 max-md:flex-col max-sm:flex-col">
        <div className="max-md:w-1/2 sm:w-full space-y-6 max-sm:w-full  max-h-[40rem] max-sm:max-h-[50rem] overflow-y-scroll ">
          {/* Personal Information */}

          <div className="space-y-3 ">
            <h3 className="text-2xl text-gray-900 mb-5">{data?.name}</h3>

            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex gap-2 items-center text-gray-600">
                <Phone size={16} />
                <span>Phone</span>
              </div>
              <p className="text-gray-900">{data?.phone}</p>
              <div className="flex gap-2 items-center text-gray-600">
                <Phone size={16} />
                <span>Second Phone</span>
              </div>
              <p className="text-gray-900">{data?.secondPhone}</p>

              <div className="flex gap-2 items-center text-gray-600">
                <Mail size={16} />
                <span>Email</span>
              </div>
              <p className="text-gray-900">{data?.email}</p>

              <div className="flex gap-2 items-center text-gray-600">
                <MapPin size={16} />
                <span>Address</span>
              </div>
              <p className="text-gray-900">{data?.address}</p>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-3">
            <h3 className="text-md text-gray-900 mb-2 flex iteams-center ">
             
              {/* <div className=" flex items-center gap-2 text-white px-4  rounded-md bg-blue-600">Collaborators
                <Modal title={''} classname={'bg-[#4E49F2] text-white  bg-blue-600 p-0 shadow-none hover:bg-blue-600'} icon='Add'>
                  <FormComponent formdata={{ formurl: 'addcollboratorform' }} />
                </Modal>
              </div> */}

              <h3 className="text-sm text-gray-900 mb-3">
                Collborators
              </h3>
              
            </h3>
            <div className="grid grid-cols-2 gap-y-4">

              <div className="flex gap-2 items-center text-gray-600">
                <Briefcase size={16} />
                <span>Collborators</span>
              </div>
              {
                data?.collaborators?.length > 0 ? <div className="flex gap-2">
                  {data?.collaborators?.map((item) => (
                    <div key={item.id} className="bg-blue-400 text-white px-2 py-1 rounded-md text-xs">
                      @{item.name}
                    </div>
                  ))}
                </div> : <p className="text-gray-900">No collborators</p>
              }
            </div>
          </div>

          {/* Follow-up Information */}

          <div className="space-y-3">
            {/* <div className=" flex items-center gap-2 text-white px-4   rounded-md bg-blue-400 max-w-[9rem]">Follow-up
              <Modal title={''} classname={'bg-[#4E49F2] text-white  bg-blue-400 p-0 shadow-none hover:bg-blue-400 '} icon='Add'>
                <FormComponent formdata={{ formurl: 'addfollowupform' }} />
              </Modal>
            </div> */}
            <h3 className="text-sm text-gray-900 mb-3">
              Follow-up
            </h3>
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

              <div className={"flex gap-2 items-center text-gray-600"}>
                <Briefcase size={16} />
                <span>Status</span>
              </div>

              <div
                className={
                  "capitalize px-2 py-1 rounded-full w-20 text-center " +
                  ` ${data?.leadStatus === "active"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  }`
                }
              >
                {data?.leadStatus}
              </div>
              <div className="flex gap-2 items-center text-gray-600">
                <Briefcase size={16} />
                <span>Stage</span>
              </div>
              <div className="text-gray-900">{data?.leadStage}</div>

              <div className="flex gap-2 items-center text-gray-600">
                <Briefcase size={16} />
                <span>Source</span>
              </div>
              <div className="text-gray-900">{data?.leadSource}</div>
              <div className="flex gap-2 items-center text-gray-900">
                <Briefcase size={16} />
                <span>Last Contact</span>
              </div>
              <div className="text-gray-900">
                {/* {formatDate(data?.lastContactTime)} */}
              </div>
            </div>
          </div>

          <div className="">
            <h3 className="text-sm text-gray-900 mb-3">Notes</h3>
            <p className="text-gray-700">{data?.notes}</p>
          </div>

          <div className="hidden max-sm:block  mr-4">
            <h3 className="text-sm text-gray-900 mb-3">Comments</h3>
           
              <CommentsSection comments={Comments} />
           
          </div>

          <div className="">
            <h3 className="text-sm text-gray-900 mb-3 flex items-start">
            
              <button className=" flex items-center gap-2 bg-green-600 text-white px-4  rounded-md">  Stage History <Modal title={''} classname={'bg-[#4E49F2] text-white  bg-green-600 p-0 shadow-none hover:bg-green-600'} icon='Add'>
                <FormComponent id={data?.id} formdata={{ formurl: 'changestageform' }} />
              </Modal></button>
            
            </h3>
            {
              data?.stageChangeHistory?.length > 0 && (
                <LeadTimeline data={data?.stageChangeHistory} />
              )
            }

          </div>
        </div>
        <div className="max-md:w-1/2 sm:w-full space-y-6 max-md:px-0 px-5 max-sm:hidden">
          <CommentsSection comments={Comments} />
        </div>

      </div>

    </div>
  );
}
