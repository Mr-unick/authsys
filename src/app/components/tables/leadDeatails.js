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
  Route,
  Pin,
  Timer,
  PhoneCall,
  MessageSquare,
  History,
  Info,
  ExternalLink,
  Target,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import Link from 'next/link';
import LeadTimeline from "../charts/leadTimeline";
import CommentsSection from "./commentsSection";
import Modal from "../modal";
import FormComponent from "../forms/form";
import { ToolTipComponent } from "../tooltip";
import { Button } from "../../../components/components/ui/button";
import PopupModal from "../poppupmodal";
import { useContext, useEffect, useState } from "react";
import { LeadContext } from "@/app/contexts/leadontext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";

export default function LeadDetails({ data, refresh }) {
  const { lead, setLead } = useContext(LeadContext);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);

  useEffect(() => {
    setLead(data);
  }, [data]);

  if (!lead && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6 animate-in fade-in duration-500">
        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
          <User className="h-20 w-20 text-slate-200" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#0F1626]">Lead Not Found</h3>
          <p className="text-sm text-slate-400 mt-2 font-medium uppercase tracking-widest">Unable to load lead data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-6 py-4 space-y-8 animate-in fade-in duration-700">

      {/* ── Dashboard Primary Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3.5 rounded-2xl shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
            <User className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1626] tracking-tight">{lead?.name}</h1>
            <div className="flex items-center gap-2.5 mt-1.5">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold rounded-full uppercase tracking-widest">
                {lead?.leadStage || 'Prospect'}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                Ref ID: #{lead?.id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 mr-2">
            <ToolTipComponent title="Previous Lead">
              <Button
                asChild
                variant="outline"
                className={`h-11 w-11 p-0 rounded-xl border-slate-200 hover:bg-slate-50 transition-all ${!lead?.navigation?.previous ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={!lead?.navigation?.previous}
              >
                <Link href={lead?.navigation?.previous ? `/leads/details/${lead.navigation.previous}` : '#'}>
                  <ChevronLeft size={20} className="text-slate-600" />
                </Link>
              </Button>
            </ToolTipComponent>
            <ToolTipComponent title="Next Lead">
              <Button
                asChild
                variant="outline"
                className={`h-11 w-11 p-0 rounded-xl border-slate-200 hover:bg-slate-50 transition-all ${!lead?.navigation?.next ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={!lead?.navigation?.next}
              >
                <Link href={lead?.navigation?.next ? `/leads/details/${lead.navigation.next}` : '#'}>
                  <ChevronRight size={20} className="text-slate-600" />
                </Link>
              </Button>
            </ToolTipComponent>
          </div>


          <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-2xl border border-slate-100 ml-auto md:ml-0">
            <ToolTipComponent title="Direct Call">
              <a href={`tel:${lead?.phone}`} className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all group">
                <PhoneCall size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </ToolTipComponent>
            <ToolTipComponent title="WhatsApp">
              <a href={`https://wa.me/${lead?.phone?.replace(/\D/g, '')}`} target="_blank" className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-md transition-all group">
                <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </ToolTipComponent>
            <ToolTipComponent title="Email">
              <a href={`mailto:${lead?.email}`} className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-100 hover:shadow-md transition-all group">
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </ToolTipComponent>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left Column: Detailed Insights ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Core Info Card */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-white border-b border-gray-50 py-5 px-6">
              <CardTitle className="text-sm font-bold text-[#0F1626] flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Info size={16} />
                </div>
                Lead Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50 bg-white">
                <div className="p-5 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400 group-hover:text-indigo-500 transition-colors"><Mail size={16} /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Email</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#0F1626] truncate max-w-[180px]">{lead?.email || '—'}</span>
                </div>
                <div className="p-5 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400 group-hover:text-indigo-500 transition-colors"><Phone size={16} /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Contact</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#0F1626]">{lead?.phone || '—'}</span>
                </div>
                <div className="p-5 flex flex-col gap-2 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400 group-hover:text-indigo-500 transition-colors"><MapPin size={16} /></div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Region</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#0F1626] leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-50">{lead?.address || '—'}</span>
                </div>
                <div className="p-5 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400 group-hover:text-indigo-500 transition-colors"><Pin size={16} /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Channel</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#0F1626] bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{lead?.leadSource || 'Manual'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Planning Card */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-white border-b border-gray-50 py-5 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-[#0F1626] flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Calendar size={16} />
                </div>
                Next Objective
              </CardTitle>
              {lead?.addfollowup && (
                <Modal
                  title={'Schedule Follow-up'}
                  classname={'hidden'}
                  open={followUpOpen}
                  onOpenChange={setFollowUpOpen}
                  customebutton={
                    <button onClick={() => setFollowUpOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-100 border border-white/10 hover:scale-[1.02] active:scale-95">
                      <Plus size={12} strokeWidth={3} /> Plan Objective
                    </button>
                  }
                >
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-3">Strategic Reminder</p>
                    <FormComponent
                      id={lead?.id}
                      formdata={{ formurl: 'addfollowupform' }}
                      onSuccess={() => { setFollowUpOpen(false); if (refresh) refresh(); }}
                    />
                  </div>
                </Modal>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {lead?.nextFollowUp ? (
                <div className="flex items-center gap-5 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100 group">
                  <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center shrink-0 border border-indigo-50 transition-transform group-hover:scale-110">
                    <span className="text-[10px] font-black text-indigo-400 uppercase leading-none mb-1">
                      {new Date(lead.nextFollowUp).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-black text-indigo-900 leading-none">
                      {new Date(lead.nextFollowUp).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#0F1626] tracking-tight">
                      {new Date(lead.nextFollowUp).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-xs text-indigo-500/70 font-bold uppercase tracking-widest mt-0.5">Automated Alert Set</p>
                  </div>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-center justify-center gap-3 text-slate-300 border border-dashed border-slate-100 rounded-xl p-8">
                  <Bell size={24} className="opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No follow-up objective</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collaborative Access */}
          {lead?.viewcollborator && (
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="bg-white border-b border-gray-50 py-5 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-[#0F1626] flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <UserPlus size={16} />
                  </div>
                  Team Access
                </CardTitle>
                {lead?.addcollborator && (
                  <PopupModal
                    setChange={refresh}
                    modaltype={'addcollaborators'}
                    data={[lead?.id]}
                    classname={'text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 border border-white/10 hover:scale-[1.02] active:scale-95'}
                  >
                    <Plus size={12} strokeWidth={3} /> Share Access
                  </PopupModal>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  {lead?.collaborators?.length > 0 ? lead.collaborators.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/50 border border-slate-50 group transition-all hover:bg-white hover:shadow-sm">
                      <div className="h-8 w-8 rounded-lg bg-[#0F1626] text-white flex items-center justify-center font-black text-[10px] shrink-0">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{item.name}</span>
                    </div>
                  )) : (
                    <div className="w-full flex flex-col items-center py-4 opacity-30">
                      <ShieldCheck size={20} className="mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Confidential Lead</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* ── Right Column: Dynamic Timeline ── */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <Card className="flex-1 border-none shadow-sm rounded-2xl overflow-hidden flex flex-col bg-white">
            <Tabs defaultValue="comments" className="flex-1 flex flex-col">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3 sm:py-5 px-6 flex flex-row items-center justify-between">
                <TabsList className="bg-slate-200/50 p-1 rounded-xl h-auto gap-1 w-full sm:w-auto">
                  <TabsTrigger value="comments" className="flex-1 sm:flex-none rounded-lg px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-[#0F1626] data-[state=active]:text-white data-[state=active]:shadow-md">
                    Discussion
                  </TabsTrigger>
                  <TabsTrigger value="stage" className="flex-1 sm:flex-none rounded-lg px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-[#0F1626] data-[state=active]:text-white data-[state=active]:shadow-md">
                    Lead Pipeline
                  </TabsTrigger>
                </TabsList>
                <div className="hidden sm:flex items-center gap-2 text-slate-400">
                  <Clock size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Real-time update</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col min-h-[550px]">
                <TabsContent value="comments" className="mt-0 flex-1 border-none ring-0 outline-none flex flex-col focus-visible:ring-0">
                  <div className="flex-1 flex flex-col focus-visible:ring-0">
                    {lead?.viewcomment
                      ? <CommentsSection comments={lead.comments} addcomment={lead?.addcomment} />
                      : <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-300">
                        <ShieldCheck size={40} className="opacity-10 mb-4" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Internal Discussion Restricted</p>
                      </div>
                    }
                  </div>
                </TabsContent>

                <TabsContent value="stage" className="mt-0 flex-1 border-none ring-0 outline-none flex flex-col focus-visible:ring-0">
                  <div className="flex-1 flex flex-col p-6 focus-visible:ring-0">
                    {lead?.viewstage ? (
                      <div className="flex-1 flex flex-col">

                        {/* Understated Status Header */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50/50">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Status</span>
                              <span className="text-xs font-black uppercase text-[#0F1626] tracking-widest leading-none">{lead.leadStage}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {lead?.changestage && (
                              <Modal
                                title={'Update Stage'}
                                classname={'hidden'}
                                icon='Update'
                                open={stageOpen}
                                onOpenChange={setStageOpen}
                                customebutton={
                                  <button
                                    className="text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 border border-white/10 hover:scale-[1.02] active:scale-95"
                                  >
                                    <Plus size={12} strokeWidth={3} /> Update Stage
                                  </button>
                                }
                              >
                                <div className="p-4">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-3 flex items-center gap-2">
                                    <Target size={14} className="text-indigo-400" /> Progression Control
                                  </p>
                                  <FormComponent
                                    id={lead?.id}
                                    formdata={{ formurl: 'changestageform' }}
                                    onSuccess={() => { setStageOpen(false); if (refresh) refresh(); }}
                                  />
                                </div>
                              </Modal>
                            )}
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic hidden sm:block px-2 border-l border-slate-100">History Log</span>
                          </div>
                        </div>

                        {/* Historical Log Entries (Latest First) */}
                        {lead.stageChangeHistory && lead.stageChangeHistory.length > 0 ? (
                          lead.stageChangeHistory.map((log, index) => {
                            const isLatest = index === 0;
                            const dateString = new Date(log.changedAt).toLocaleDateString();
                            const timeString = new Date(log.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const attributedUser = log.changedBy?.name || 'System';

                            return (
                              <div key={index} className="flex gap-4 group">
                                {/* Minimalist Line Indicator */}
                                <div className="flex flex-col items-center shrink-0">
                                  <div
                                    style={{
                                      backgroundColor: log.stage?.colour || '#4F46E5',
                                      borderColor: log.stage?.colour || '#4F46E5',
                                    }}
                                    className={`
                                        w-3 h-3 rounded-full border flex items-center justify-center transition-all duration-300 z-10 mt-1.5
                                        ${isLatest ? 'ring-4 ring-indigo-50' : 'opacity-40'}
                                      `}
                                  >
                                    {!isLatest && <Check size={8} strokeWidth={5} className="text-white" />}
                                  </div>

                                  <div
                                    className="w-0.5 flex-1 min-h-[40px] my-1 rounded-full opacity-10"
                                    style={{ backgroundColor: log.stage?.colour || '#4F46E5' }}
                                  />
                                </div>

                                {/* Log Details */}
                                <div className={`flex-1 pb-6 w-full`}>
                                  <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="text-[10px] font-bold uppercase tracking-wider"
                                        style={{ color: log.stage?.colour || '#4F46E5' }}
                                      >
                                        {log.stage?.stage_name}
                                      </span>
                                      {isLatest && <span className="text-[8px] font-bold text-indigo-500 bg-indigo-50 px-1 rounded">Latest</span>}
                                    </div>
                                    <span className="text-[9px] font-medium text-slate-300">
                                      {dateString} • {timeString}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                    <span className="font-bold text-slate-600">{attributedUser.split(' ')[0]}</span>
                                    {log.reason && (
                                      <>
                                        <span className="text-slate-200">•</span>
                                        <span className="italic truncate max-w-[250px] text-slate-400">
                                          "{log.reason}"
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : null}

                        {/* Initial Creation Record */}
                        <div className="flex gap-4 group opacity-60">
                          <div className="flex flex-col items-center shrink-0">
                            <div className="w-3 h-3 rounded-full border border-slate-200 bg-slate-50 mt-1.5" />
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Lead Creation</span>
                              <span className="text-[9px] font-medium text-slate-200">System Entry</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium italic">
                              Initial intake and assignment logic executed.
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-300 font-bold uppercase tracking-widest">
                        <ShieldCheck size={40} className="opacity-10 mb-4" />
                        Access Restricted
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

      </div>
    </div>
  );
}
