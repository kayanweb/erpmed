import React, { useState, useEffect } from "react";
import { Utensils, Apple, Droplet, Plus, Save, Clock, User, AlertTriangle } from "lucide-react";
import { useHIS } from "../context/HISContext";

export function PatientNutritionTab({ isAr, patientId, patientName }: any) {
  const { getSetting, saveSetting } = useHIS();
  const [dietOrder, setDietOrder] = useState<any>({ diet: "Normal", allergy: "None", notes: "" });
  const [nutritionNotes, setNutritionNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    getSetting("hospital_patient_diets").then(savedDiets => {
      if (savedDiets && savedDiets[patientId]) {
        setDietOrder(savedDiets[patientId]);
      }
    });

    getSetting(`hospital_nutrition_notes_${patientId}`).then(savedNotes => {
      if (savedNotes) {
        setNutritionNotes(savedNotes);
      }
    });
  }, [patientId, getSetting]);

  const saveNote = async () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now().toString(),
      text: newNote,
      date: new Date().toISOString(),
      author: "Clinical Dietitian"
    };
    const updated = [note, ...nutritionNotes];
    setNutritionNotes(updated);
    setNewNote("");
    await saveSetting(`hospital_nutrition_notes_${patientId}`, updated);
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        <Utensils className="w-5 h-5 sm:w-8 sm:h-8 text-orange-500 bg-orange-100 p-1.5 rounded-xl" />
        <h3 className="text-xl font-black text-slate-800">
          {isAr ? "التغذية العلاجية" : "Clinical Nutrition"}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Apple className="w-5 h-5 text-emerald-500" />
              {isAr ? "النظام الغذائي الحالي" : "Current Diet Order"}
            </h4>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-500 mb-1">{isAr ? "النوع" : "Diet Type"}</div>
                <div className="font-black text-lg text-orange-600">{dietOrder.diet}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 mb-1">{isAr ? "الحساسية" : "Allergies"}</div>
                <div className={`font-bold ${dietOrder.allergy && dietOrder.allergy !== "None" && dietOrder.allergy !== "لا يوجد" ? "text-rose-600" : "text-emerald-600"}`}>
                  {dietOrder.allergy || (isAr ? "لا يوجد" : "None")}
                </div>
              </div>
              {dietOrder.notes && (
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-1">{isAr ? "ملاحظات المطبخ" : "Kitchen Notes"}</div>
                  <div className="font-medium text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {dietOrder.notes}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium">
                {isAr ? "ملاحظة: يتم تحديث النظام الغذائي من خلال شاشة التغذية العلاجية (Clinical Nutrition)." : "Note: Diet orders are updated from the Clinical Nutrition dashboard."}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              {isAr ? "إضافة ملاحظة تغذية (Nutrition Note)" : "Add Nutrition Note"}
            </h4>
            <textarea
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:border-orange-500 outline-none h-24 resize-none mb-3 font-medium"
              placeholder={isAr ? "اكتب تفاصيل التقييم الغذائي والملاحظات هنا..." : "Write nutrition assessment and notes here..."}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex justify-end">
              <button 
                onClick={saveNote}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4" />
                {isAr ? "حفظ الملاحظة" : "Save Note"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              {isAr ? "سجل التغذية" : "Nutrition History"}
            </h4>
            {nutritionNotes.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-100">
                {isAr ? "لا توجد ملاحظات تغذية مسجلة." : "No nutrition notes recorded."}
              </div>
            ) : (
              nutritionNotes.map((note) => (
                <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">{note.author}</div>
                        <div className="text-xs text-slate-500">{new Date(note.date).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{note.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
