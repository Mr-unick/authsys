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
  UserPlus,
} from "lucide-react";
import LeadTimeline from "../charts/leadTimeline";

import CommentsSection from "./commentsSection";
import Modal from "../modal";
import FormComponent from "../forms/form";
import { ToolTipComponent } from "../tooltip";
import { Button } from "../../../components/components/ui/button";
import { Comments } from "../../../../const";
import PopupModal from "../poppupmodal";
import { useContext, useEffect } from "react";
import { LeadContext } from "@/app/contexts/leadontext";







export default function LeadDetails({ data }) {

  const {lead ,setLead }= useContext(LeadContext);

  useEffect(()=>{
    setLead(data)
  },[])

  useEffect(()=>{

  },[lead])

  return (
    <div className=" px-2 max-sm:px-0 h-full  ">
      <div className="flex w-full gap-2 text-sm py-4 pl-4 max-md:flex-col max-sm:flex-col ">
        <div className="max-md:w-1/2 sm:w-full space-y-6 max-sm:w-full  max-h-[40rem] max-sm:max-h-[50rem] ">
          {/* Personal Information */}
          <div className="space-y-3 ">
            <h3 className="text-2xl text-gray-900 mb-5">{lead?.name}</h3>

            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex gap-2 items-center text-gray-600">
                <Phone size={16} />
                <span>Phone</span>
              </div>
              <p className="text-gray-900">{lead?.phone}</p>
              <div className="flex gap-2 items-center text-gray-600">
                <Phone size={16} />
                <span>Second Phone</span>
              </div>
              <p className="text-gray-900">{lead?.secondPhone}</p>

              <div className="flex gap-2 items-center text-gray-600">
                <Mail size={16} />
                <span>Email</span>
              </div>
              <p className="text-gray-900">{lead?.email}</p>

              <div className="flex gap-2 items-center text-gray-600">
                <MapPin size={16} />
                <span>Address</span>
              </div>
              <p className="text-gray-900">{lead?.address}</p>
            </div>
          </div>

          {/* Professional Information */}
          {
            lead?.viewcollborator && <div className="space-y-3">
              <h3 className="text-md text-gray-900  flex iteams-center flex justify-between  py-2">
                <p>Collborators</p>

                {
                  lead?.addcollborator && <PopupModal modaltype={'addcollaborators'} lead={[lead?.id]} classname={' text-sm text-blue-600 flex gap-2 shodow-none outline-none hover:bg-white p-0 focus-none'} ><p className='max-sm:hidden'>Add Collborators </p><Plus size={18} /></PopupModal>
                }

              </h3>
              <div className="grid grid-cols-2 gap-y-4">

                <div className="flex gap-2 items-center text-gray-600">
                  <Briefcase size={16} />
                  <span>Collborators</span>
                </div>
                {
                  lead?.collaborators?.length > 0 ? <div className="flex gap-2">
                    {lead?.collaborators?.map((item) => (
                      <div key={item.id} className="bg-blue-400 text-white px-2 py-1 rounded-md text-xs">
                        @{item.name}
                      </div>
                    ))}
                  </div> : <p className="text-gray-900">No collborators</p>
                }
              </div>
            </div>
          }
         

          {/* Follow-up Information */}

          <div className="space-y-3">
            
            <h3 className="text-md text-gray-900  flex iteams-center flex justify-between  flex items-center  ">
              Follow-up
              <div className=" flex items-center gap-2 text-blue-600   rounded-md  max-w-[9rem]">
              <Modal title={'Add Follow-up'} classname={' p-0 shadow-none bg-white text-blue-600 hover:bg-white '} >
                <FormComponent formlead={{ formurl: 'addfollowupform' }} />
              </Modal>
              <Plus size={18} />
            </div>
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
                  ` ${lead?.leadStatus === "active"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  }`
                }
              >
                {lead?.leadStatus}
              </div>

              <div className="flex gap-2 items-center text-gray-600">
                <Briefcase size={16} />
                <span>Stage</span>
              </div>
              <div className="text-gray-900">{lead?.leadStage}</div>

              <div className="flex gap-2 items-center text-gray-600">
                <Briefcase size={16} />
                <span>Source</span>
              </div>
              <div className="text-gray-900">{lead?.leadSource}</div>
              <div className="flex gap-2 items-center text-gray-900">
                <Briefcase size={16} />
                <span>Last Contact</span>
              </div>
              <div className="text-gray-900">
                {/* {formatDate(lead?.lastContactTime)} */}
              </div>
            </div>
          </div>

          <div className="">
            <h3 className="text-sm text-gray-900 mb-3">Notes</h3>
            <p className="text-gray-700">{lead?.notes}</p>
          </div>

         {
            lead?.viewcomment  && <div className="hidden max-sm:block  mr-4">
              <h3 className="text-sm text-gray-900 mb-3">Comments</h3>

              <CommentsSection comments={lead.comments} addcomment={lead?.addcomment} />

            </div>
         }
          {
            lead?.viewstage && <div className="">
              <h3 className="text-md text-gray-900  flex iteams-center flex justify-between  flex items-center ">
              Stage History
                {
                  lead?.changestage && 
                  <div className=" flex items-center gap-2  text-blue-600  rounded-md "> 
                  <Modal title={'Add Stage History'} classname={'bg-white text-blue-600 p-0 shadow-none hover:bg-white'}>
                    <FormComponent id={lead?.id} formdata={{ formurl: 'changestageform' }} />
                  </Modal>
                  <Plus size={18} />
                  </div> 
                }
              </h3>
              {
                lead?.stageChangeHistory?.length > 0 && (
                  <LeadTimeline data={lead?.stageChangeHistory} />
                )
              }

            </div>
          }
          
        </div>

        {
          lead?.viewcomment ? <div className="max-md:w-1/2 sm:w-full space-y-6 max-md:px-0 px-5 max-sm:hidden">
            <CommentsSection comments={lead.comments} />
          </div> : <div className="max-md:w-1/2 sm:w-full space-y-6 max-md:px-0 px-5 max-sm:hidden">
            {" "}
          </div>
        }
       
      </div>

    </div>
  );
}
