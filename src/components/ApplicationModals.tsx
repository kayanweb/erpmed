import React from "react";
import { X, Calendar, Search } from "lucide-react";
import ProfileView from "./ProfileView";
import { PatientChartModal } from "./PatientChartModal";
import { EntityDetailModal } from "./EntityDetailModal";
import GenericActionModal from "./GenericActionModal";
import { BaseDialog } from "./ui/BaseDialog";

interface ApplicationModalsProps {
  language: "ar" | "en";
  currentUser: any;
  systemUsers: any[];
  activeCellEdit: any;
  setActiveCellEdit: (val: any) => void;
  handleSaveCellEdit: (val: string) => void;
  activeRosterCellEdit: any;
  setActiveRosterCellEdit: (val: any) => void;
  selectedRosterDept: string;
  selectedRosterPeriod: string;
  itStrictComplianceMode: boolean;
  setRosterList: (fn: (prev: any[]) => any[]) => void;
  saveSetting: (key: string, val: any) => void;
  addSystemLog: (msg: string, type: string) => void;
  viewingUserProfileUser: any;
  setViewingUserProfileUser: (val: any) => void;
  selectedNotificationForModal: any;
  setSelectedNotificationForModal: (val: any) => void;
  handleNotificationClick: (notif: any) => void;
  activeEntityDetail: any;
  setActiveEntityDetail: (val: any) => void;
  activePatientChart: any;
  setActivePatientChart: (val: any) => void;
  activeTab: string;
  CLINICAL_SHIFTS: any[];
  resolveRoleTitles: (role: string) => { ar: string; en: string };
}

export const ApplicationModals: React.FC<ApplicationModalsProps> = ({
  language,
  currentUser,
  systemUsers,
  activeCellEdit,
  setActiveCellEdit,
  handleSaveCellEdit,
  activeRosterCellEdit,
  setActiveRosterCellEdit,
  selectedRosterDept,
  selectedRosterPeriod,
  itStrictComplianceMode,
  setRosterList,
  saveSetting,
  addSystemLog,
  viewingUserProfileUser,
  setViewingUserProfileUser,
  selectedNotificationForModal,
  setSelectedNotificationForModal,
  handleNotificationClick,
  activeEntityDetail,
  setActiveEntityDetail,
  activePatientChart,
  setActivePatientChart,
  activeTab,
  CLINICAL_SHIFTS,
  resolveRoleTitles,
}) => {
  return (
    <>
      {/* CUSTOM CELL EDIT MODAL */}
      <BaseDialog 
        isOpen={!!activeCellEdit} 
        onClose={() => setActiveCellEdit(null)}
        className="max-w-sm"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="bg-slate-900 px-5 py-4 text-white flex justify-between items-center">
            <h4 className="text-sm font-black flex items-center gap-2">
              <Search className="h-4 w-4 text-indigo-400" />
              <span>
                {language === "ar" ? "تعديل محتوى الخانة" : "Edit Cell Content"}
              </span>
            </h4>
            <button
              onClick={() => setActiveCellEdit(null)}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
        </div>
        
        <div className="p-6 space-y-4 font-sans">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {language === "ar" ? "القيمة الجديدة:" : "New Value:"}
                </label>
                <div className="flex gap-2 min-w-max">
                  <input
                    id="custom-cell-input"
                    type="text"
                    defaultValue={activeCellEdit?.currentValue}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const inputEl = document.getElementById(
                          "custom-cell-input",
                        ) as HTMLInputElement;
                        if (inputEl) {
                          handleSaveCellEdit(inputEl.value.trim());
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const inputEl = document.getElementById(
                        "custom-cell-input",
                      ) as HTMLInputElement;
                      if (inputEl) {
                        handleSaveCellEdit(inputEl.value.trim());
                      }
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {language === "ar" ? "تأكيد" : "Save"}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleSaveCellEdit("")}
                  className="text-xs text-slate-400 hover:text-rose-600 transition underline cursor-pointer"
                >
                  {language === "ar"
                    ? "إعادة تعيين (تفريغ الخانة)"
                    : "Reset (Clear cell)"}
                </button>
              </div>

              <div className="flex gap-2 justify-start pt-4 border-t border-slate-100 text-xs flex-row-reverse">
                <button
                  onClick={() => setActiveCellEdit(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-extrabold transition cursor-pointer"
                >
                  {language === "ar" ? "إلغاء وإغلاق" : "Cancel & Close"}
                </button>
              </div>
        </div>
      </BaseDialog>


      {/* CUSTOM ROSTER CELL EDIT MODAL */}
      {activeRosterCellEdit && (
        <div className="fixed inset-0 bg-slate-50/65 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in font-sans text-right"
            dir="rtl"
          >
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-5 py-4 text-white flex justify-between items-center">
              <h4 className="text-sm font-black flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-indigo-200" />
                <span>
                  {language === "ar"
                    ? `تعديل نوبتجية اليوم: يوم ${activeRosterCellEdit.dayKey}`
                    : `Edit Duty Shift: Day ${activeRosterCellEdit.dayKey}`}
                </span>
              </h4>
              <button
                onClick={() => setActiveRosterCellEdit(null)}
                className="text-white hover:opacity-80 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <div className="text-[10px] text-indigo-600 font-bold uppercase">
                  {language === "ar"
                    ? "الموظف المستهدف بالقسم:"
                    : "Target Staff Member:"}
                </div>
                <h5 className="font-extrabold text-slate-900 mt-1">
                  {language === "ar"
                    ? activeRosterCellEdit.employeeNameAr
                    : activeRosterCellEdit.employeeNameEn}
                </h5>
                <p className="text-xs text-slate-500 font-mono mt-0.5" dir="ltr">
                  Currently Assigned:{" "}
                  <span className="text-indigo-600 font-bold">
                    {activeRosterCellEdit.currentShift}
                  </span>
                </p>
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-black text-slate-700">
                  {language === "ar"
                    ? "اختر وردية جديدة للربط المباشر:"
                    : "Assign new shift period:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {CLINICAL_SHIFTS.map((sh) => (
                    <button
                      key={sh.id}
                      onClick={() => {
                        const isSelfEdit =
                          activeRosterCellEdit.employeeId === currentUser.id ||
                          (activeRosterCellEdit.employeeCode &&
                            activeRosterCellEdit.employeeCode ===
                              currentUser.staffId);
                        
                        if (
                          itStrictComplianceMode &&
                          currentUser?.role === "staff" &&
                          !isSelfEdit
                        ) {
                          alert(
                            language === "ar"
                              ? "غير مسموح لك بتعديل وردية زميلك"
                              : "Access Denied: You cannot modify another staff member's shift.",
                          );
                          setActiveRosterCellEdit(null);
                          return;
                        }

                        if (activeRosterCellEdit.currentShift === sh.id) {
                          setActiveRosterCellEdit(null);
                          return;
                        }

                        setRosterList((prevList) => {
                          const monthKey = selectedRosterPeriod || "2026-05";
                          const existsSpec = prevList.some(
                            (r) =>
                              r.departmentName === selectedRosterDept &&
                              (r.month === monthKey || monthKey === "2026-05"),
                          );

                          let listToMap = [...prevList];
                          if (!existsSpec) {
                            listToMap.push({
                              id: `roster-${selectedRosterDept}-${monthKey}-${Date.now()}`,
                              departmentName: selectedRosterDept,
                              month: monthKey,
                              rows: [],
                            });
                          }

                          const nextRosterList = listToMap.map((rost) => {
                            const isSelectedMatch =
                              rost.departmentName === selectedRosterDept &&
                              (rost.month === monthKey || monthKey === "2026-05");
                            
                            if (!isSelectedMatch) return rost;

                            const hasEmployee = rost.rows.some(
                              (r: any) =>
                                r.employeeId === activeRosterCellEdit.employeeId ||
                                r.employeeCode === activeRosterCellEdit.employeeCode,
                            );

                            let updatedRows = [];
                            if (hasEmployee) {
                              updatedRows = rost.rows.map((row: any) => {
                                if (
                                  row.employeeId === activeRosterCellEdit.employeeId ||
                                  row.employeeCode === activeRosterCellEdit.employeeCode
                                ) {
                                  return {
                                    ...row,
                                    shifts: {
                                      ...row.shifts,
                                      [activeRosterCellEdit.dayKey]: sh.id,
                                    },
                                  };
                                }
                                return row;
                              });
                            } else {
                              const systemUser = systemUsers.find(
                                (u) => u.id === activeRosterCellEdit.employeeId,
                              );
                              const newRow = {
                                employeeId: activeRosterCellEdit.employeeId,
                                employeeNameAr: activeRosterCellEdit.employeeNameAr,
                                employeeNameEn: activeRosterCellEdit.employeeNameEn,
                                roleTitleAr: resolveRoleTitles(systemUser?.role).ar,
                                roleTitleEn: resolveRoleTitles(systemUser?.role).en,
                                employeeCode: systemUser?.staffId || "GUEST",
                                shifts: {
                                  [activeRosterCellEdit.dayKey]: sh.id,
                                },
                              };
                              updatedRows = [...rost.rows, newRow];
                            }

                            return { ...rost, rows: updatedRows };
                          });
                          
                          saveSetting("baheya_department_rosters", nextRosterList);
                          return nextRosterList;
                        });
                        
                        addSystemLog(
                          `Shift updated for ${activeRosterCellEdit.employeeNameEn} on day ${activeRosterCellEdit.dayKey}.`,
                          "info",
                        );
                        setActiveRosterCellEdit(null);
                      }}
                      className="py-2 px-3 border border-slate-200 text-slate-800 hover:bg-indigo-50 hover:border-indigo-300 font-bold text-center rounded-xl transition duration-150 cursor-pointer"
                    >
                      {sh.nameAr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => setActiveRosterCellEdit(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  {language === "ar" ? "الغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Personal Profile Dialog overlay */}
      {viewingUserProfileUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-dropdown animate-fade">
          <div
            className="bg-slate-50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-250 text-right font-sans"
            dir="rtl"
          >
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setViewingUserProfileUser(null)}
                className="p-1 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl text-xs transition duration-150 cursor-pointer"
              >
                إغلاق ×
              </button>
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 pt-0.5">
                <span>الملف السريري والبطاقة التشغيلية الشخصية للكادر</span>
              </h3>
            </div>
            <div className="p-6">
              <ProfileView
                user={viewingUserProfileUser}
                language={language}
                systemUsers={systemUsers}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Pop-up Modal for Notifications / Alerts */}
      {selectedNotificationForModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-dropdown animate-fade">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 text-right font-sans"
            dir="rtl"
          >
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔔</span>
                <div className="text-right">
                  <h3 className="font-black text-sm">
                    {language === "ar"
                      ? "تفاصيل التنبيه الإداري والسريري"
                      : "Notification & Alert Details"}
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    {new Date(selectedNotificationForModal.timestamp).toLocaleString(language === "ar" ? "ar-EG" : "en-US")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotificationForModal(null)}
                className="p-1 px-3 bg-white/10 hover:bg-white/20 text-white font-extrabold rounded-xl text-xs transition duration-150 cursor-pointer"
              >
                {language === "ar" ? "إغلاق ×" : "Close ×"}
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <h4 className="font-bold text-slate-800 text-sm mt-1">
                  {language === "ar" ? selectedNotificationForModal.titleAr : selectedNotificationForModal.titleEn}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 whitespace-pre-wrap">
                  {language === "ar" ? (selectedNotificationForModal.bodyAr || selectedNotificationForModal.messageAr) : (selectedNotificationForModal.bodyEn || selectedNotificationForModal.messageEn)}
                </p>
              </div>

              {selectedNotificationForModal.targetTab && (
                <button
                  onClick={() => {
                    handleNotificationClick(selectedNotificationForModal);
                    setSelectedNotificationForModal(null);
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg active:translate-y-0.5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🚀</span>
                  <span>{language === "ar" ? "التوجيه الفوري والانتقال إلى الصفحة المعنية" : "Direct Route to Target Section Now"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeEntityDetail && (
        <EntityDetailModal
          entity={activeEntityDetail.entity}
          type={activeEntityDetail.type}
          isAr={language === "ar"}
          onClose={() => setActiveEntityDetail(null)}
        />
      )}

      {activePatientChart && (
        <PatientChartModal
          patientId={activePatientChart.patientId}
          patientName={activePatientChart.patientName}
          initialTab={activePatientChart.initialTab}
          isAr={language === "ar"}
          onClose={() => setActivePatientChart(null)}
        />
      )}

      <GenericActionModal />
    </>
  );
};
