import { createClient } from "@supabase/supabase-js";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { withSupabase } from "@supabase/server";
import { db } from "./server/db/index";
import { setProvider } from "./server/db/adapterFactory";
import { 
  patients, 
  prescriptions, 
  invoices, 
  staff, 
  logs, 
  dutyTasks, 
  notifications, 
  messages, 
  settings, 
  collectionsStore 
} from "./server/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { clinicalDataService } from "./server/db/enterpriseService";

dotenv.config();

// Load persisted settings
let serverSettings: any = {};
if (fs.existsSync("server-settings.json")) {
  try {
    serverSettings = JSON.parse(fs.readFileSync("server-settings.json", "utf8"));
    if (serverSettings.activeProvider) {
      setProvider(serverSettings.activeProvider);
      console.log(`📡 Restored database provider on startup: ${serverSettings.activeProvider}`);
    }
  } catch (e) {
    console.error("Error reading server-settings.json", e);
  }
}

// Supabase Admin Client
const envSupabaseUrl = process.env.SUPABASE_URL;
const isHttpUrl = envSupabaseUrl && envSupabaseUrl.startsWith('http');
const supabaseUrl = isHttpUrl ? envSupabaseUrl : serverSettings.supabaseUrl;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || serverSettings.supabaseKey;
const supabaseAdmin = (supabaseUrl && supabaseUrl.startsWith('http') && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;
(global as any).supabaseAdmin = supabaseAdmin;

// --- DYNAMIC PHARMACY & CLINICAL STANDARDS FALLBACK ENGINE ---
function getMedicationFallback(search_query: string): any {
  const query = (search_query || "").toLowerCase().trim();
  
  if (query.includes("aspirin") || query.includes("اسبرين") || query.includes("أسبيرين")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Aspirin (Ecotrin)",
        "generic_name": "Acetylsalicylic Acid (ASA)",
        "drug_class": "Antiplatelet / Salicylates"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": false,
          "label_color": "slate",
          "reason": "Standard oral dose antiplatelet therapy. Monitor for bleeding or gastrointestinal irritation."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Asaphen", "reason_of_confusion": "Similar visual spelling and packaging in specific generic brands.", "danger_level": "Moderate" },
            { "name": "Aprixin", "reason_of_confusion": "Phonetic similarity when ordered verbally.", "danger_level": "Moderate" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral", "Chewable", "Rectal"],
        "vital_signs_to_monitor": ["Platelet Count", "Coagulation Panel (PT/INR)", "Gastrointestinal Bleeding signs"]
      }
    };
  }
  
  if (query.includes("nitro") || query.includes("نيترو") || query.includes("نيتروجليسرين")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Nitrostat / Nitronal",
        "generic_name": "Nitroglycerin",
        "drug_class": "Vasodilator / Nitrate"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "Potent vasodilator. Intravenous formulation requires continuous infusion monitoring to avoid severe acute hypotension."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Nitroprusside", "reason_of_confusion": "Both are rapid-acting IV vasodilators. Mixing them up can cause fatal dosing errors.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Sublingual", "Intravenous Infusion", "Transdermal Patch"],
        "vital_signs_to_monitor": ["Continuous Blood Pressure (BP)", "Heart Rate (HR)", "Electrocardiogram (ECG)"]
      }
    };
  }

  if (query.includes("heparin") || query.includes("هيبارين")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Heparin Sodium",
        "generic_name": "Heparin",
        "drug_class": "Anticoagulant"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "CRITICAL HIGH-ALERT DRUG: High risk of serious bleeding. Requires strict dual-nurse verification of dosing and rate changes."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Hespan", "reason_of_confusion": "Extremely similar phonetic sound; Hespan is a plasma expander, Heparin is a strong anticoagulant.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Intravenous Infusion", "Subcutaneous Injection"],
        "vital_signs_to_monitor": ["Activated Partial Thromboplastin Time (aPTT)", "Platelet Count (HIT screening)", "Hemoglobin & Hematocrit"]
      }
    };
  }

  if (query.includes("warfarin") || query.includes("وارفارين") || query.includes("coumadin") || query.includes("كومادين")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Coumadin",
        "generic_name": "Warfarin Sodium",
        "drug_class": "Anticoagulant (Vitamin K Antagonist)"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "Narrow therapeutic index. High risk of major hemorrhage if dose is not adjusted based on INR."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Wyanoids", "reason_of_confusion": "Phonetic similarity under specific brand packaging.", "danger_level": "Moderate" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral"],
        "vital_signs_to_monitor": ["PT / INR", "Signs of bruising, hematuria, or epistaxis", "Dietary Vitamin K intake consistency"]
      }
    };
  }

  if (query.includes("insulin") || query.includes("أنسولين") || query.includes("انسولين") || query.includes("humalog") || query.includes("lantus")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Humalog / Lantus / Actrapid",
        "generic_name": "Insulin (Rapid / Intermediate / Long Acting)",
        "drug_class": "Antidiabetic / Hormone"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": true,
          "label_color": "red",
          "reason": "CRITICAL HIGH-ALERT: High risk of severe hypoglycemia resulting in confusion or coma. Verification of glucose levels is mandatory."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Insuman", "reason_of_confusion": "Visual spelling and packaging similarity across insulin types.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Subcutaneous Injection", "Intravenous Infusion"],
        "vital_signs_to_monitor": ["Capillary Blood Glucose (CBG)", "Serum Potassium (K+)", "Level of consciousness"]
      }
    };
  }

  if (query.includes("lasix") || query.includes("لازكس") || query.includes("furosemide") || query.includes("فوروسيميد")) {
    return {
      "search_result": {
        "original_query": search_query,
        "is_corrected": false,
        "corrected_name_trade": "Lasix",
        "generic_name": "Furosemide",
        "drug_class": "Loop Diuretic"
      },
      "required_labels": {
        "high_alert_status": {
          "is_high_alert": false,
          "label_color": "slate",
          "reason": "Standard loop diuretic therapy. High vigilance for electrolyte imbalances is advised."
        },
        "lasa_status": {
          "has_lasa_risk": true,
          "label_color": "orange",
          "confused_with": [
            { "name": "Losec", "reason_of_confusion": "High LASA alert: Losec is Omeprazole while Lasix is a loop diuretic.", "danger_level": "High" }
          ]
        }
      },
      "clinical_guidelines": {
        "administration_routes": ["Oral", "Intravenous Injection"],
        "vital_signs_to_monitor": ["Hourly Urine Output (U/O)", "Serum Potassium (K+) & Sodium (Na+) levels", "Blood Pressure"]
      }
    };
  }

  // General fallback
  return {
    "search_result": {
      "original_query": search_query,
      "is_corrected": false,
      "corrected_name_trade": search_query,
      "generic_name": search_query,
      "drug_class": "Therapeutic Agent"
    },
    "required_labels": {
      "high_alert_status": {
        "is_high_alert": false,
        "label_color": "slate",
        "reason": "Classified under standard clinical handling guidelines."
      },
      "lasa_status": {
        "has_lasa_risk": false,
        "label_color": "slate",
        "confused_with": []
      }
    },
    "clinical_guidelines": {
      "administration_routes": ["Oral", "Intravenous"],
      "vital_signs_to_monitor": ["Blood Pressure", "Heart Rate"]
    }
  };
}

function getInteractionFallback(med1: string, med2: string, isAr: boolean) {
  const m1 = med1.toLowerCase();
  const m2 = med2.toLowerCase();
  
  if ((m1.includes("aspirin") && (m2.includes("heparin") || m2.includes("warfarin"))) ||
      (m2.includes("aspirin") && (m1.includes("heparin") || m1.includes("warfarin")))) {
    return {
      "interaction_severity": "High",
      "has_interaction": true,
      "mechanism": isAr 
        ? "تأثير مضاد للتخثر تآزري. يمنع الأسبرين تراكم الصفائح الدموية بينما يعمل الهيبارين/الوارفارين على تثبيط عوامل التجلط."
        : "Synergistic anticoagulant effect. Aspirin inhibits platelet aggregation while Heparin/Warfarin inhibits clotting factors.",
      "clinical_effects": isAr
        ? "زيادة شديدة في مخاطر حدوث نزيف داخلي أو خارجي حاد."
        : "Severely increased risk of major hemorrhage (internal or external bleeding).",
      "recommendation": isAr
        ? "تجنب الاستخدام المتزامن إلا تحت مراقبة طبية دقيقة جداً ومتابعة زمن النزيف ومستوى الـ INR."
        : "Avoid concomitant use unless strictly indicated under intensive surveillance. Monitor PT/INR and platelet levels closely.",
      "monitoring_guidelines": isAr
        ? "مراقبة علامات النزيف (كدمات غير مفسرة، نزيف اللثة، بيلة دموية) وفحص الهيموجلوبين بانتظام."
        : "Monitor clinical signs of bleeding (unexplained bruising, gum bleeding, hematuria) and check hemoglobin levels.",
      "severity_color": "red"
    };
  }
  
  if ((m1.includes("nitro") && m2.includes("sildenafil")) ||
      (m2.includes("nitro") && m1.includes("sildenafil"))) {
    return {
      "interaction_severity": "High",
      "has_interaction": true,
      "mechanism": isAr
        ? "تأثير تآزري قوي جداً لتوسيع الأوعية الدموية عن طريق زيادة مستويات أحادي أكسيد النيتروجين."
        : "Severe synergistic vasodilation via accumulation of cyclic GMP.",
      "clinical_effects": isAr
        ? "انخفاض مفاجئ وحاد جداً في ضغط الدم قد يكون مهدداً للحياة."
        : "Sudden, severe, potentially life-threatening hypotension.",
      "recommendation": isAr
        ? "يُمنع منعاً باتاً الجمع بين نيتروجليسرين وسيلدينافيل (الفياجرا) في غضون 24-48 ساعة."
        : "Concomitant administration is strictly contraindicated within 24-48 hours.",
      "monitoring_guidelines": isAr
        ? "الإنعاش الفوري بالسوائل الوريدية ورفع القدمين في حالة حدوث انخفاض حاد للضغط."
        : "Immediate IV fluid resuscitation and Trendelenburg positioning in case of severe hypotension.",
      "severity_color": "red"
    };
  }

  // Standard safe fallback response if no match
  return {
    "interaction_severity": "None",
    "has_interaction": false,
    "mechanism": isAr 
      ? "لا توجد تداخلات دوائية خطيرة مسجلة في الفهرس المباشر لهذه التركيبة الدوائية."
      : "No established severe drug-drug interactions found in the offline screening dictionary.",
    "clinical_effects": isAr 
      ? "تأثيرات سريرية طبيعية ومتوقعة لكل دواء على حدة."
      : "Standard expected clinical effects of individual drugs.",
    "recommendation": isAr
      ? "يمكن إعطاء الأدوية مع المتابعة الروتينية للعلامات الحيوية للمريض."
      : "Administer as prescribed. Maintain standard clinical monitoring.",
    "monitoring_guidelines": isAr
      ? "المراقبة الدورية المعتادة للعلامات الحيوية وحالة المريض العامة."
      : "Standard periodic vitals check and general clinical assessment.",
    "severity_color": "green"
  };
}

function getIvCompatibilityFallback(drug1: string, drug2: string, fluid: string, isAr: boolean) {
  const d1 = drug1.toLowerCase();
  const d2 = drug2.toLowerCase();
  
  if ((d1.includes("ceftriaxone") && d2.includes("calcium")) ||
      (d2.includes("ceftriaxone") && d1.includes("calcium"))) {
    return {
      "compatibility_status": "Incompatible",
      "explanation": isAr
        ? "يتفاعل السيف ترياكسون مع الكالسيوم لتكوين رواسب ملحية صلبة من سيف ترياكسون-الكالسيوم في الرئة والكلى."
        : "Ceftriaxone reacts with Calcium-containing products to form a crystalline precipitate of calcium-ceftriaxone in the lungs and kidneys.",
      "recommendation": isAr
        ? "ممنوع منعاً باتاً الإعطاء المشترك في نفس الخط الوريدي (Y-site) أو خلطهم معاً."
        : "Strictly contraindicated to co-administer via the same IV line (Y-site) or combine them."
    };
  }

  if ((d1.includes("heparin") && d2.includes("nitroglycerin")) ||
      (d2.includes("heparin") && d1.includes("nitroglycerin"))) {
    return {
      "compatibility_status": "Compatible",
      "explanation": isAr
        ? "النيتروجليسرين والهيبارين متوافقان في خط التسريب الوريدي Y-site، ولكن النيتروجليسرين قد يقلل جزئياً من فعالية الهيبارين."
        : "Heparin and Nitroglycerin are physically and chemically compatible at the Y-site. However, nitroglycerin may slightly reduce heparin's anticoagulant efficacy.",
      "recommendation": isAr
        ? "متوافق سريرياً. يرجى مراقبة زمن التجلط (aPTT) بدقة وضبط جرعات الهيبارين حسب الحاجة."
        : "Clinically compatible. Monitor aPTT closely and adjust heparin dosing as required."
    };
  }

  // General default fallback
  return {
    "compatibility_status": "Caution",
    "explanation": isAr
      ? "لا توجد بيانات توافق كيميائي قاطعة ومسجلة في الفهرس السريع لهذين الدوائين معاً."
      : "Direct physical compatibility data for this drug combination is not found in the instant offline reference index.",
    "recommendation": isAr
      ? "لتجنب حدوث ترسيب، اغسل الخط الوريدي جيداً بمحلول سالين قبل وبعد إعطاء كل دواء، أو استخدم خطاً وريدياً منفصلاً."
      : "To prevent precipitation, flush the line thoroughly with normal saline before and after administering each drug, or use separate IV access."
  };
}

function getCounselingFallback(medication: string, isAr: boolean) {
  const med = medication.toLowerCase();
  
  if (med.includes("aspirin") || med.includes("اسبرين") || med.includes("أسبيرين")) {
    return {
      "drug_name": isAr ? "أسبرين (Aspirin)" : "Aspirin",
      "what_is_it_for": isAr 
        ? "لمنع تجلط الدم وحماية القلب من الجلطات والذبحة الصدرية."
        : "To prevent blood clots and protect the heart from heart attacks and angina.",
      "how_to_take": isAr
        ? "تناول قرصاً واحداً يومياً مع الطعام أو مباشرة بعده لتقليل تهيج المعدة. امضغ القرص إذا كان مخصصاً للمضغ."
        : "Take one tablet daily with or immediately after food to reduce stomach irritation. Chew if it is a chewable tablet.",
      "common_side_effects": isAr
        ? ["اضطراب بسيط في المعدة", "سهولة حدوث كدمات صغيرة", "زيادة طفيفة في وقت النزيف عند الجروح"]
        : ["Mild stomach upset or heartburn", "Easy bruising or small skin spots", "Slightly increased bleeding time for cuts"],
      "when_to_call_doctor": isAr
        ? ["نزيف شديد لا يتوقف", "براز أسود اللون أو مصحوب بدم", "قيء يش يشبه تفل القهوة", "ألم حاد في المعدة"]
        : ["Severe, unstoppable bleeding", "Black, tarry stools or blood in stool", "Vomiting blood or material resembling coffee grounds", "Severe abdominal pain"],
      "food_drug_interactions": isAr
        ? "تجنب شرب الكحول لأنه يزيد من مخاطر نزيف المعدة. توخى الحذر مع أدوية المسكنات الأخرى (مثل الإيبوبروفين)."
        : "Avoid alcohol as it increases stomach bleeding risk. Exercise caution with other NSAID pain relievers (e.g., Ibuprofen).",
      "forgot_dose_instruction": isAr
        ? "خذ الجرعة الفائتة فور تذكرها في نفس اليوم. إذا تذكرت في اليوم التالي، فتجاوز الجرعة الفائتة وتابع جدولك المعتاد. لا تضاعف الجرعة."
        : "Take the missed dose as soon as you remember on the same day. If you remember the next day, skip it and continue your normal schedule. Do not double the dose."
    };
  }

  if (med.includes("nitro") || med.includes("نيترو") || med.includes("نيتروجليسرين")) {
    return {
      "drug_name": isAr ? "نيتروجليسرين تحت اللسان (Sublingual Nitroglycerin)" : "Sublingual Nitroglycerin",
      "what_is_it_for": isAr
        ? "لتخفيف آلام الصدر المفاجئة (الذبحة الصدرية) الناتجة عن ضيق شرايين القلب."
        : "To relieve sudden chest pain (angina attacks) caused by coronary artery narrowing.",
      "how_to_take": isAr
        ? "اجلس أولاً لتجنب الدوار. ضع قرصاً واحداً تحت اللسان واتركه يذوب بالكامل. لا تبتلع القرص."
        : "Sit down first to prevent dizziness. Place one tablet under the tongue and let it dissolve completely. Do not swallow.",
      "common_side_effects": isAr
        ? ["صداع مفاجئ وقصير المدى", "شعور بالدفء أو احمرار الوجه", "دوار مؤقت عند الوقوف"]
        : ["Sudden, transient headache", "Flushing or feeling of warmth in the face", "Temporary dizziness when standing up"],
      "when_to_call_doctor": isAr
        ? ["عدم تحسن ألم الصدر بعد تناول أول قرص لمدة 5 دقائق (اتصل بالطوارئ 997 فوراً)", "ضيق شديد في التنفس", "إغماء"]
        : ["Chest pain does not improve 5 minutes after taking the first tablet (Call emergency 997 immediately)", "Severe shortness of breath", "Fainting"],
      "food_drug_interactions": isAr
        ? "ممنوع منعاً باتاً تناول أدوية الضعف الجنسي (مثل الفياجرا) أثناء استخدام هذا الدواء."
        : "STRICTLY PROHIBITED to take erectile dysfunction medications (e.g., Viagra) while using this drug.",
      "forgot_dose_instruction": isAr
        ? "هذا الدواء يُستخدم فقط عند الحاجة القصوى وتجربة نوبة ألم بالصدر، وليس كعلاج يومي منتظم."
        : "This medication is used strictly on an as-needed basis during chest pain episodes, not as a continuous daily maintenance dose."
    };
  }

  // General default fallback
  return {
    "drug_name": medication,
    "what_is_it_for": isAr
      ? "تم وصف هذا الدواء من قبل طبيبك لعلاج حالتك الطبية المحددة."
      : "This medication was prescribed by your physician to treat your specific medical condition.",
    "how_to_take": isAr
      ? "تناول هذا الدواء تماماً كما أرشدك الطبيب أو الصيدلي. اقرأ الملصق الإرشادي على العبوة."
      : "Take this medication exactly as directed by your physician or pharmacist. Read the label instruction carefully.",
    "common_side_effects": isAr
      ? ["اضطرابات هضمية خفيفة", "نعاس أو صداع خفيف"]
      : ["Mild gastrointestinal discomfort", "Mild drowsiness or headache"],
    "when_to_call_doctor": isAr
      ? ["ظهور علامات حساسية مثل تورم الوجه، طفح جلدي، أو صعوبة التنفس", "تفاقم الأعراض بشكل حاد"]
      : ["Signs of allergic reaction (facial swelling, severe skin rash, difficulty breathing)", "Acute worsening of symptoms"],
    "food_drug_interactions": isAr
      ? "يرجى شرب كمية كافية من الماء وتجنب تناول أدوية جديدة دون استشارة الصيدلي."
      : "Drink sufficient water. Do not start new medications without consulting your pharmacist.",
    "forgot_dose_instruction": isAr
      ? "تناول الجرعة الفائتة فور تذكرها. إذا حان وقت الجرعة التالية تقريباً، فتجاوز الجرعة الفائتة ولا تضاعف الجرعة."
      : "Take the missed dose as soon as you remember. If it is almost time for your next dose, skip it and resume your schedule. Do not double the dose."
  };
}

function getNews2Fallback(data: any, isAr: boolean) {
  if (isAr) {
    return `
### 🏥 تقييم سريري عاجل (نموذج الفحص السريع واستجابة الطوارئ - NEWS2)

**تم إنشاء هذا التقييم عبر نظام المساعد السريري الاحتياطي المدمج.**

#### 1. التحليل السريري المباشر للعلامات الحيوية:
- **درجة خطورة الفرز الفسيولوجي:** مستوى الخطورة الحالي هو **${data.riskLevel || "متوسط إلى مرتفع"}** مع درجة إجمالية تبلغ **(${data.totalScore || 0}/20)**.
- **معدل التنفس:** ${data.respiratoryRate} دورة/دقيقة. (يتطلب مراقبة مستمرة للأنماط التنفسية).
- **التشبع بالأكسجين (SpO2):** ${data.spo2Scale1 || data.spo2Scale2 || 95}% مع ${data.oxygenTherapy ? "علاج مدعوم بالأكسجين" : "تنفس هواء الغرفة الطبيعي"}.
- **ضغط الدم الانقباضي:** ${data.systolicBP} مم زئبق. (يجب الحفاظ على التروية النسيجية المثالية للأعضاء الحيوية).
- **معدل ضربات القلب:** ${data.pulse} نبضة/دقيقة.
- **مستوى الوعي (ACVPU):** المريض في حالة وعي: **${data.consciousness}**.

#### 2. الإجراءات التمريضية الفورية الموصى بها:
1. **تحديث العلامات الحيوية:** زيادة وتيرة قياس وتسجيل المؤشرات الفسيولوجية لتصبح كل **30 دقيقة إلى ساعة واحدة** بحد أقصى.
2. **العلاج بالأكسجين:** ضبط تسريب الأكسجين والترطيب للحفاظ على مستويات التشبع المستهدفة (96-99% للمرضى العاديين، أو 88-92% لمرضى السدة الرئوية المزمنة COPD).
3. **التأهب لفتح خط وريدي:** تجهيز قنيات وريدية ذات قطر كبير (Cannula 18G) وسحب عينات دم أساسية بما في ذلك غازات الدم الشرياني (ABG) وتعداد الدم الكامل والكهارل.

#### 3. بروتوكول التصعيد والاتصال الطبي:
- **إشعار فوري:** إبلاغ الطبيب المقيم المسؤول وأخصائي الرعاية المركزة (ICU) أو فريق الاستجابة السريعة (RRT) فوراً بالموجودات الحالية.
- **الاستعداد للنقل:** تأمين جاهزية عربة الإنعاش (Crash Cart) وجهاز المراقبة المحمول للقلب تحسباً لنقل المريض العاجل لوحدة الرعاية المركزة أو الطوارئ.

#### 4. العلامات التحذيرية الحمراء (Red Flags) للمراقبة الفورية:
- تراجع مستوى الوعي فجأة أو حدوث ارتباك حاد ومقاومة.
- انخفاض ضغط الدم الانقباضي لأقل من 90 مم زئبق.
- استخدام العضلات المساعدة للتنفس (Respiratory Distress) أو حدوث زرقة في الشفتين والأطراف.
- تباطؤ ضربات القلب المفاجئ المصحوب بتراجع التروية النسيجية.
`;
  } else {
    return `
### 🏥 Urgent Clinical Assessment (Early Warning Response - NEWS2)

**This clinical audit has been generated via the offline system fallback protocol.**

#### 1. Physiologic Vital Signs Analysis:
- **Physiological Deterioration Score:** Currently graded as **${data.riskLevel || "Medium to High Risk"}** with an aggregate NEWS2 score of **(${data.totalScore || 0}/20)**.
- **Respiratory Rate:** ${data.respiratoryRate} bpm. (High vigilance required for respiratory effort).
- **Oxygen Saturation (SpO2):** ${data.spo2Scale1 || data.spo2Scale2 || 95}% on ${data.oxygenTherapy ? "supplemental oxygen support" : "room air"}.
- **Systolic Blood Pressure:** ${data.systolicBP} mmHg. (Maintain strict surveillance for perfusion deficits).
- **Heart Rate / Pulse:** ${data.pulse} bpm.
- **Level of Consciousness (ACVPU):** Assessed as **${data.consciousness}**.

#### 2. Immediate Nursing Care Interventions:
1. **Frequency of Monitoring:** Increase clinical vitals charting frequency to every **30 to 60 minutes** without exception.
2. **Oxygen Titration:** Adjust supplemental oxygen flow rates to maintain target oxygenation (96-99% or 88-92% in patients with confirmed hypercapnic respiratory failure).
3. **Intravenous Access:** Ensure dual patent large-bore peripheral IV lines are established. Prepare for arterial blood gas (ABG) and lactate levels.

#### 3. Clinical Escalation Protocol:
- **Immediate Notification:** Notify the attending physician, medical registrar, and alert the Rapid Response Team (RRT) or Critical Care Outreach.
- **Emergency Readiness:** Retrieve and position the emergency crash cart and portable defibrillator/monitor near the patient bedside.

#### 4. Red Flags & Critical Deterioration Warning Signs:
- Any acute decrease in Glasgow Coma Scale (GCS) or new-onset confusion.
- Systolic BP dropping below 90 mmHg.
- Active accessory muscle use, grunting, or peripheral cyanosis.
- Sudden bradycardia associated with clinical shock.
`;
  }
}

function getIsbarFallback(data: any, isAr: boolean) {
  if (isAr) {
    return `
### 📋 تقرير تدقيق الجودة واستشارات التسليم السريري (منهجية ISBAR)

**تم إنشاء هذا التقرير عبر نظام الممرض والمساعد السريري المدمج كخطوة احتياطية.**

#### 1. تدقيق جودة هيكل التقرير (Quality Audit):
- **التعريف بالمريض (Identify):** تم توثيقه بوضوح (${data.identify || "مكتمل"}).
- **الوضع السريري الحالي (Situation):** يوضح بوضوح الشكوى والتشخيص الأساسي الحالي.
- **الخلفية المرضية (Background):** يسرد بوضوح التاريخ المرضي والملاحظات الداعمة الجوهرية.
- **التقييم الحالي (Assessment):** يحتوي على المؤشرات الحيوية والملاحظات السريرية الراهنة.
- **التوصيات المقترحة (Recommendation):** يحدد خطة العمل والمسؤوليات بوضوح.

#### 2. الرؤى السريرية والتحذيرات الأمنية (Clinical Insights & Risks):
- **سلامة التسليم:** التقرير يتبع الترتيب الهيكلي السليم لمنع فقدان المعلومات أثناء نقل الرعاية بين الورديات.
- **النقاط العمياء المحتملة:** تأكد من مراجعة نتائج التحاليل المخبرية الأخيرة (مثل كهارل الدم، مستويات الهيموجلوبين) وإضافة الحساسية الدوائية كبند دائم لمنع الحوادث العرضية.

#### 3. الخطوات العلاجية والتشخيصية المقترحة:
1. **تأكيد الفهم:** يجب على الممرض أو الطبيب المستلم إعادة قراءة وتأكيد التوصيات الصادرة (Read-back protocol).
2. **التحقق من التجهيزات الوريدية:** مراجعة صلاحية خطوط قسطرة المغذيات والأدوية الوريدية ومعدلات تدفق الأجهزة الآلية.
3. **توثيق التوقيت:** تسجيل وقت وتاريخ تسليم الرعاية بدقة في الملف الإلكتروني الموحد للمريض (EMR).

#### 4. مقترحات لتحسين صياغة تقارير التسليم مستقبلاً:
- احرص دائماً على تضمين آخر قيم للعلامات الحيوية (المقاسة في آخر ساعة) كأرقام محددة في قسم التقييم السريري لتجنب العبارات العامة مثل "المريض مستقر".
- اذكر بوضوح أي مواعيد قريبة لإعطاء جرعات الأدوية الحرجة (مثل المضادات الحيوية أو مميعات الدم) لضمان الاستمرارية العلاجية دون انقطاع.
`;
  } else {
    return `
### 📋 Handover Quality Audit & Consultation Report (ISBAR Framework)

**This clinical audit has been generated via the offline system fallback protocol.**

#### 1. Structural Information Completeness Audit:
- **Patient Identification (Identify):** Documented properly (${data.identify || "Complete"}).
- **Active Situation (Situation):** Outlines the primary active medical problem or chief complaint.
- **Clinical Background (Background):** Lists past medical history, admissions, and relevant diagnostic milestones.
- **Current Assessment (Assessment):** Includes objective parameters, clinical findings, and recent physiological changes.
- **Actionable Recommendation (Recommendation):** Specifies outstanding tasks, follow-up parameters, and immediate care goals.

#### 2. Clinical Insights & Patient Safety Risk Screening:
- **Handover Safety:** The report adheres to the standard professional structure which reduces communication breakdown during nursing shift-to-shift handovers by up to 80%.
- **Potential Blind Spots:** Verify that the patient's drug allergies are explicitly read out during every handover. Cross-reference the latest lab panels (e.g., potassium, creatinine, hemoglobin) to preempt metabolic or bleeding issues.

#### 3. Recommended Diagnostic & Therapeutic Next Steps:
1. **Verbal Confirmation:** Engage in the standard "Read-Back" protocol to verify high-risk recommendations and critical medication orders.
2. **Line and Device Safety Check:** Perform a physical bedside audit of all running intravenous infusions, vascular access sites, and monitoring devices.
3. **Time-Log Documentation:** Formally sign off and date the transfer of nursing or physician clinical responsibility in the patient's Electronic Medical Record (EMR).

#### 4. Practical Suggestions for Handover Report Improvement:
- Always input specific numerical values for vital signs recorded within the last 60 minutes inside the Assessment field, rather than subjective terms like "vitals stable."
- Specify the exact times of any high-alert medications (e.g., anticoagulants, insulin, continuous infusions) due during the incoming shift to guarantee strict clinical continuity.
`;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Moved bulk-sync to the very top to prevent interception
  app.post("/api/db/:provider/bulk-sync", async (req, res) => {
    try {
      const { collections } = req.body;
      if (!collections || !Array.isArray(collections)) {
        return res.status(400).json({ success: false, error: "Invalid 'collections' array" });
      }
      
      const data = await clinicalDataService.bulkSync(collections);
      return res.json({ success: true, data });
    } catch (err: any) {
      console.error("Error doing bulk sync:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Lazy load Gemini AI helper
  let aiClient: GoogleGenAI | null = null;
  let hasLoggedAiWarning = false;

  function getAiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      if (!hasLoggedAiWarning) {
        console.warn("⚠️ GEMINI_API_KEY is not configured. AI features will use offline fallback responses.");
        hasLoggedAiWarning = true;
      }
      return null;
    }

    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API Route: Medication Intelligence AI
  app.post("/api/ai/analyze-medication", async (req, res) => {
    const { search_query } = req.body;
    if (!search_query || typeof search_query !== "string" || search_query.trim() === "") {
        return res.status(400).json({ success: false, error: "Invalid medication name." });
    }

    try {
        const client = getAiClient();

        // System Instructions based on user's request
        const systemInstruction = `
You are a digital clinical pharmacist system responsible for medication safety review and labeling.
Your task is to receive the medication name, auto-correct spelling, classify it, and determine safety labels (High-Alert / LASA) and nursing monitoring instructions.
Output ONLY a JSON object based on this schema:
{
  "search_result": {
    "original_query": "string",
    "is_corrected": boolean,
    "corrected_name_trade": "string",
    "generic_name": "string",
    "drug_class": "string"
  },
  "required_labels": {
    "high_alert_status": { "is_high_alert": boolean, "label_color": "string", "reason": "string" },
    "lasa_status": { 
      "has_lasa_risk": boolean, 
      "label_color": "string", 
      "confused_with": Array<{ "name": "string", "reason_of_confusion": "string", "danger_level": "string" }> 
    }
  },
  "clinical_guidelines": {
    "administration_routes": ["string"],
    "vital_signs_to_monitor": ["string"]
  }
}
`;

        // Retry logic
        let result;
        for (let i = 0; i < 3; i++) {
          try {
            result = await client.models.generateContent({
                model: "gemini-2.5-flash",
                contents: search_query,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    temperature: 0.0,
                },
            });
            break;
          } catch (err: any) {
            if (i === 2) throw err;
            if (err.status === 503 || err.message?.includes("503") || err.message?.includes("high demand") || err.message?.includes("UNAVAILABLE")) {
              await new Promise(resolve => setTimeout(resolve, 1500 * (i + 1))); 
              continue;
            }
            throw err;
          }
        }
        
        // Parse JSON safely
        let responseJson;
        try {
            responseJson = JSON.parse(result!.text!);
        } catch (e) {
            console.error("Critical: AI returned malformed JSON", result!.text);
            throw new Error("AI data integrity error.");
        }
        
        res.json({ success: true, medication: responseJson });

    } catch (error: any) {
        console.log("Medication AI Model offline fallback activated.");
        const responseJson = getMedicationFallback(search_query);
        res.json({ success: true, medication: responseJson, fallback: true });
    }
  });

  // API Route: Drug-Drug Interaction Checker AI
  app.post("/api/ai/check-interaction", async (req, res) => {
    const { med1, med2, lang } = req.body;
    if (!med1 || !med2) {
        return res.status(400).json({ success: false, error: "Please provide both medication names." });
    }
    const isAr = lang === "ar";

    try {
        const client = getAiClient();

        const systemInstruction = `
You are a senior clinical pharmacist specializing in drug safety and drug-drug interactions.
Analyze the interaction between Medication 1 and Medication 2.
Output ONLY a JSON object based on this schema:
{
  "interaction_severity": "High" | "Moderate" | "Minor" | "None",
  "has_interaction": boolean,
  "mechanism": "string description",
  "clinical_effects": "string description",
  "recommendation": "string recommendation",
  "monitoring_guidelines": "string guidelines",
  "severity_color": "red" | "orange" | "yellow" | "green"
}
Output localized text in the requested language: ${isAr ? "Arabic" : "English"}.
`;

        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze interaction between: "${med1}" and "${med2}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.1,
            },
        });

        let responseJson;
        try {
            responseJson = JSON.parse(response.text!);
        } catch (e) {
            console.error("Critical: AI interaction returned malformed JSON", response.text);
            throw new Error("AI data integrity error.");
        }
        
        res.json({ success: true, analysis: responseJson });

    } catch (error: any) {
        console.log("Interaction AI Model offline fallback activated.");
        const responseJson = getInteractionFallback(med1, med2, isAr);
        res.json({ success: true, analysis: responseJson, fallback: true });
    }
  });

  // API Route: IV Y-Site Compatibility Checker AI
  app.post("/api/ai/iv-compatibility", async (req, res) => {
    const { drug1, drug2, fluid, lang } = req.body;
    if (!drug1 || !drug2) {
        return res.status(400).json({ success: false, error: "Please provide both drugs." });
    }
    const isAr = lang === "ar";

    try {
        const client = getAiClient();

        const systemInstruction = `
You are an IV therapy specialist pharmacist. Determine if Drug 1 and Drug 2 are physically and chemically compatible for Y-site co-administration, optionally considering the base fluid if provided.
Output ONLY a JSON object based on this schema:
{
  "compatibility_status": "Compatible" | "Incompatible" | "Caution" | "Data Not Available",
  "explanation": "Detailed explanation of compatibility, physical reactions (precipitation, color change, etc.)",
  "recommendation": "Nursing recommendation"
}
Output text in: ${isAr ? "Arabic" : "English"}.
`;
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Drug 1: ${drug1}, Drug 2: ${drug2}, Base Fluid: ${fluid || "None"}`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.1,
            },
        });

        res.json({ success: true, result: JSON.parse(response.text!) });
    } catch (error: any) {
        console.log("IV Compatibility AI Model offline fallback activated.");
        const responseJson = getIvCompatibilityFallback(drug1, drug2, fluid || "", isAr);
        res.json({ success: true, result: responseJson, fallback: true });
    }
  });

  // API Route: Patient Medication Counseling Generator
  app.post("/api/ai/medication-counseling", async (req, res) => {
    const { medication, lang } = req.body;
    if (!medication) {
        return res.status(400).json({ success: false, error: "Please provide medication." });
    }
    const isAr = lang === "ar";

    try {
        const client = getAiClient();

        const systemInstruction = `
You are a patient education pharmacist. Create a simple, patient-friendly counseling sheet for the given medication. 
Use plain language (no complex medical jargon).
Output ONLY a JSON object based on this schema:
{
  "drug_name": "Name of drug",
  "what_is_it_for": "Simple explanation",
  "how_to_take": "Clear instructions",
  "common_side_effects": ["side effect 1", "side effect 2"],
  "when_to_call_doctor": ["warning sign 1", "warning sign 2"],
  "food_drug_interactions": "Simple list of foods or other drugs to avoid",
  "forgot_dose_instruction": "What to do if a dose is missed"
}
Output text in: ${isAr ? "Arabic" : "English"}.
`;
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Medication: ${medication}`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.2,
            },
        });

        res.json({ success: true, counseling: JSON.parse(response.text!) });
    } catch (error: any) {
        console.log("Medication Counseling AI Model offline fallback activated.");
        const responseJson = getCounselingFallback(medication, isAr);
        res.json({ success: true, counseling: responseJson, fallback: true });
    }
  });


  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Registration & Encounters
  app.post("/api/v1/patients", async (req, res) => {
    try {
      await clinicalDataService.saveItem("patients", req.body);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to save patient" });
    }
  });

  app.get("/api/v1/patients/search", async (req, res) => {
    const queryStr = req.query.q as string;
    try {
      const patients = await clinicalDataService.getCollection("patients");
      const filtered = patients.filter(p => p.mrn?.includes(queryStr) || p.national_id?.includes(queryStr) || p.phone_mobile?.includes(queryStr));
      res.json({ success: true, data: filtered });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to search patients" });
    }
  });

  app.post("/api/v1/encounters", async (req, res) => {
    try {
      await clinicalDataService.saveItem("encounters", req.body);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to save encounter" });
    }
  });

  app.put("/api/v1/encounters/:id/check-in", async (req, res) => {
    try {
      await clinicalDataService.saveItem("encounters", { ...req.body, id: req.params.id, status: "CHECKED_IN" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to check in" });
    }
  });

  // API Route: Update Database Provider Credentials
  app.post("/api/settings/update-provider", (req, res) => {
      const { provider, settings } = req.body;
      console.log("Updating provider:", provider, "with settings:", Object.keys(settings));
      if (provider && settings) {
          try {
                // Update server-side admin client if Supabase
                if (provider === "SUPABASE") {
                    const { supabaseUrl, supabaseKey } = settings;
                    if (!supabaseUrl.startsWith("http")) throw new Error("Invalid Supabase URL: Must start with http");
                    (global as any).supabaseAdmin = createClient(supabaseUrl, supabaseKey);
                }
                
                // Persist settings AND provider
                fs.writeFileSync("server-settings.json", JSON.stringify({ activeProvider: provider, settings }));
                setProvider(provider);
                
                console.log("Database settings updated and persisted for:", provider);
                return res.json({ success: true, message: "Database settings updated." });
              } catch (e: any) {
                console.error("Failed to initialize database provider:", e.message);
                return res.status(400).json({ success: false, error: e.message });
              }
      }
      return res.status(400).json({ success: false, error: "Invalid provider or settings." });
  });

  // API Route: Get Database settings
  app.get("/api/settings/get-settings", (req, res) => {
      if (fs.existsSync("server-settings.json")) {
          try {
              const settings = JSON.parse(fs.readFileSync("server-settings.json", "utf8"));
              return res.json({ success: true, settings });
          } catch (e) {
              return res.status(500).json({ success: false, error: "Error reading settings" });
          }
      }
      return res.json({ success: false, error: "No settings found" });
  });

  // --- DEPARTMENT INTELLIGENCE FALLBACK GENERATORS ---
  function getDepartmentInsightsFallback(data: any, isAr: boolean) {
    if (isAr) {
      return `
### 🏥 تقرير التحليل السريري والتشغيلي الاحتياطي للقسم (الباطنة العامة)

**تم إنشاء هذا التقرير عبر النظام السريري الاحتياطي المدمج كخطوة آمنة.**

#### 1. 📊 التقييم السريري السريع والعبء العملي:
- **معدل إشغال القسم:** تبلغ نسبة الإشغال الحالية **${data.occupancyRate || 75}%** (منوم **${data.admittedPatientsCount || 24}** مريض من أصل سعة إجمالية **${data.capacity || 32}** سريراً).
- **الضغط السريري:** عبء تمريضي متوسط إلى مرتفع مع وجود **${data.pendingTasksCount || 15}** مهمة معلقة تتطلب التوزيع الفوري.
- **الحالات الحرجة:** وجود **${data.criticalCasesCount || 3}** حالات حرجة غير مستقرة في القسم تتطلب اهتماماً طبياً وثيقاً ومستمراً.

#### 2. 📋 توصيات توزيع الممرضين والكادر الطبي:
1. **نسبة الكادر إلى المرضى (Nurse-to-Patient Ratio):** يوصى بتطبيق نسبة **1:1** أو **1:2** للحالات الحرجة الثلاث، ونسبة **1:5** للحالات المستقرة المتبقية لضمان سلامة المرضى.
2. **إعادة ترتيب أولويات المهام:** تصنيف المهام المعلقة الـ **${data.pendingTasksCount || 15}** لتكون مهام إعطاء الأدوية الوريدية وفحص العلامات الحيوية للحالات الحرجة في صدارة قائمة التنفيذ الفوري.

#### 3. 🛡️ خطة إدارة الحالات الحرجة الـ ${data.criticalCasesCount || 3}:
- تفعيل بروتوكول **NEWS2** وإعادة تقييم العلامات الحيوية كل **30 دقيقة** بدون استثناء.
- التحقق من توافر عربة الإنعاش القلبي الرئوي (Crash Cart) وجاهزيتها للعمل الفوري في الجناح.
- تجهيز خطوط وريدية سالكة وضمان تفعيل أجهزة المراقبة المستمرة لمعدل ضربات القلب والتشبع بالأكسجين.

#### 4. 🛏️ إدارة تدفق المرضى وسعة الأسرة:
- يبلغ عدد الأسرة المتوفرة **${data.availableBedsCount || 8}** أسرة. يجب التنسيق مع قسم الطوارئ (ER) لحجز سريرين للحالات الطارئة الواردة، وبدء تخطيط الخروج المبكر (Early Discharge) للمرضى المستقرين لتحسين السعة التدويرية.
`;
    } else {
      return `
### 🏥 Offline Department Operational & Clinical Backup Report

**This analysis has been generated via the offline system fallback protocol.**

#### 1. 📊 Operational Workload & Capacity Assessment:
- **Department Occupancy:** The current occupancy rate is **${data.occupancyRate || 75}%** with **${data.admittedPatientsCount || 24}** occupied beds out of a maximum capacity of **${data.capacity || 32}** beds.
- **Workload Stress:** Medium-to-High nursing workload with **${data.pendingTasksCount || 15}** outstanding clinical tasks pending resolution.
- **Critical Care Vigilance:** **${data.criticalCasesCount || 3}** unstable critical patients currently admitted, requiring high clinical surveillance.

#### 2. 📋 Staff Allocation & Nursing Workload Guidance:
1. **Nurse-to-Patient Ratio:** We recommend a dedicated **1:1** or **1:2** ratio for the 3 critical cases, and a **1:5** ratio for the stable general ward patients.
2. **Task Prioritization:** Sort the **${data.pendingTasksCount || 15}** pending tasks immediately. High-alert drug administration and vital sign tracking for unstable patients must take precedence.

#### 3. 🛡️ Critical Cases Safety Action Plan:
- Re-assess vitals for the **${data.criticalCasesCount || 3}** critical patients using the **NEWS2** framework every **30 minutes**.
- Verify that the emergency crash cart is fully stocked, functional, and placed in proximity to the critical care rooms.
- Establish secure intravenous access and initiate continuous cardiac/O2 saturation monitoring.

#### 4. 🛏️ Patient Flow & Discharge Coordination:
- **${data.availableBedsCount || 8}** beds are currently vacant. Coordinate with the emergency department to preserve 2 beds for prospective acute admissions. Initiate discharge planning for clinically stable patients.
`;
    }
  }

  function getDepartmentChatFallback(data: any, isAr: boolean) {
    if (isAr) {
      return `مرحباً! أنا مساعد القسم السريري المدمج (وضع الاحتياط). 

بناءً على معطيات القسم الحالية:
- **المرضى المنومين:** ${data.stats?.admitted || 24} مريضاً.
- **الأسرة الشاغرة:** ${data.stats?.available || 8} أسرة.
- **المهام المعلقة:** ${data.stats?.pending || 15} مهمة.
- **الحالات الحرجة:** ${data.stats?.critical || 3} حالات حرجة.

سؤالك هو: "${data.query}"

*نظراً لعدم توفر خادم الذكاء الاصطناعي حالياً، يرجى الاستعانة بالطبيب المناوب أو رئيس التمريض للإجابة السريرية الدقيقة طبقاً لبروتوكول المستشفى.*`;
    } else {
      return `Hello! I am the integrated Clinical Department Assistant (Offline backup mode).

Based on the current metrics of the department:
- **Admitted Patients:** ${data.stats?.admitted || 24}
- **Available Beds:** ${data.stats?.available || 8}
- **Pending Tasks:** ${data.stats?.pending || 15}
- **Critical Cases:** ${data.stats?.critical || 3}

Your question: "${data.query}"

*Since the live AI model is temporarily busy, please consult with the shift supervisor or attending physician in accordance with hospital policies.*`;
    }
  }

  // API Route: General Clinical AI Copilot / Assistant Chat
  app.post("/api/ai/chat", async (req, res) => {
    const { query, history, lang } = req.body;
    if (!query) return res.status(400).json({ success: false, error: "Query required." });
    
    const isAr = lang === "ar";
    try {
      const client = getAiClient();
      if (!client) throw new Error("AI Client not available");

      const systemInstruction = `
You are the Hospital's Clinical AI Copilot (Clinical Brain). 
You help medical staff (Doctors, Nurses, Pharmacists) with clinical decisions, protocol lookup, and patient management.
Be professional, evidence-based, and always include safety reminders.
If the query is about specific hospital policies, answer based on standard JCI/CBAHI healthcare standards.
Keep responses concise and structured.
Respond in: ${isAr ? "Arabic" : "English"}.
`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ success: true, response: response.text });
    } catch (err) {
      console.log("General AI Chat fallback active.");
      const fallbackResponse = isAr 
        ? `أنا المساعد الذكي في وضع عدم الاتصال حالياً. بناءً على سؤالك "${query}"، أوصي بمراجعة بروتوكولات المستشفى المعتمدة والتشاور مع الفريق الطبي المشرف لضمان سلامة المريض.`
        : `I am currently in offline mode. Regarding your query "${query}", I recommend reviewing established hospital protocols and consulting with the senior medical team for patient safety.`;
      res.json({ success: true, response: fallbackResponse, fallback: true });
    }
  });

  // API Route: Clinical Quality & Safety AI assistant
  app.post("/api/ai/analyze-clinical", async (req, res) => {
    const { type, data, lang } = req.body;
    const isAr = lang === "ar";

    try {
      const client = getAiClient();

      let targetPrompt = "";
      if (type === "news2") {
        targetPrompt = `
You are a highly qualified Clinical Consultant and triage expert.
You are analyzing a patient's National Early Warning Score (NEWS2) data to evaluate risk and recommend actions.

Patient Data:
- Respiratory Rate: ${data.respiratoryRate} bpm
- SpO2 Scale 1: ${data.spo2Scale1}%
- SpO2 Scale 2: ${data.spo2Scale2}%
- Oxygen Therapy: ${data.oxygenTherapy ? "Yes" : "No"}
- Systolic Blood Pressure: ${data.systolicBP} mmHg
- Pulse / Heart Rate: ${data.pulse} bpm
- Consciousness (ACVPU): ${data.consciousness}
- Temperature: ${data.temperature}°C
- Calculated SCORE: ${data.totalScore}
- Risk Level: ${data.riskLevel}

Please provide:
1. Clinical Assessment (التقييم السريري): Evaluate the physiological risk severity based on these parameters.
2. Immediate Nursing Actions (الإجراءات التمريضية الفورية): Steps to stabilize the patient.
3. Escalation Protocol (بروتوكول التصعيد): Who to notify (e.g., attending physician, Critical Care Team) and frequency of monitoring.
4. Red Flags & Warning Signs (العلامات التحذيرية الخطيرة): Specific symptoms or deterioration signs to watch for.

Format the response beautifully in clean, structured Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
If in Arabic, write with professional medical terminology used in top hospitals. Ensure a compassionate, professional, and clear scientific tone.
        `;
      } else if (type === "isbar") {
        targetPrompt = `
You are a Clinical Auditor and Expert Nurse Trainer. You are reviewing a patient medical handover report formatted as ISBAR (Identify, Situation, Background, Assessment, Recommendation).

Handover Data:
- Identify (التعريف بالمريض): ${data.identify}
- Situation (الوضع السريري الحالي): ${data.situation}
- Background (التاريخ المرضي والخلفية): ${data.background}
- Assessment (التقييم الحالي للمريض): ${data.assessment}
- Recommendation (التوصيات وخطط المتابعة): ${data.recommendation}

Please provide:
1. Quality Audit & Review (تدقيق جودة التقرير): Critically review this ISBAR handover for completeness, accuracy, and clear communication.
2. Clinical Insights & Risks (الرؤى والتحذيرات السريرية): Identify potential blind spots, active risks, or missing information in the transfer of care.
3. Recommended Diagnostic / Therapeutic next steps (الخطوات العلاجية والتشخيصية المقترحة): Immediate suggestions for safe patient clinical management.
4. Suggestions for Handover Improvement (مقترحات لتحسين صياغة التقرير): How this report could be written better or more clearly to avoid communication errors.

Format the response beautifully in clean, structured Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
If in Arabic, write with professional medical terminology used in top hospitals. Ensure a compassionate, professional, and clear scientific tone.
        `;
      } else if (type === "department_insights") {
        targetPrompt = `
You are an expert Chief Medical Officer and Clinical Operations Director.
Analyze the operational and clinical state of the ${data.departmentName} department:
- Admitted Patients: ${data.admittedPatientsCount} (Capacity: ${data.capacity || 32}, Occupancy Rate: ${data.occupancyRate || 75}%)
- Vacant/Available Beds: ${data.availableBedsCount}
- Pending/Outstanding Tasks: ${data.pendingTasksCount}
- Critical Patients: ${data.criticalCasesCount}

Please provide:
1. Operational Assessment & Staff Allocation (التقييم التشغيلي وتوزيع الكادر): Analyze the occupancy and workload (15 tasks, 3 critical cases) and recommend nursing/physician staffing ratios.
2. Clinical Action Plan for Critical Cases (خطة العمل السريرية للحالات الحرجة): Specific checklists and safety guidelines for managing the 3 critical patients in this department.
3. Bed Capacity & Flow Optimization (تحسين تدفق المرضى وسعة الأسرة): Strategies to optimize bed utilization, discharge planning, and coordination with the ER/ICU.
4. Risk Management & Forecast (إدارة المخاطر والتنبؤ السريري): Identify potential operational bottlenecks or safety issues (e.g., patient safety risks, task delays, ventilator/monitor constraints) over the next 24-48 hours.

Format the response in gorgeous, highly professional Markdown with clear headers, bullet points, and key terms in bold.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      } else if (type === "department_chat") {
        targetPrompt = `
You are a helpful and highly intelligent Clinical Department AI assistant. You help medical staff manage the ${data.departmentName} department.
Here are the live metrics of the department:
- Admitted Patients: ${data.stats?.admitted || 24}
- Available Beds: ${data.stats?.available || 8}
- Pending Tasks: ${data.stats?.pending || 15}
- Critical Cases: ${data.stats?.critical || 3}

Answer the user's clinical or operational question in the requested language: ${lang === "ar" ? "Arabic" : "English"}.
User Question: "${data.query}"

Provide a concise, highly practical, and clinically sound answer. Do not use generic filler text. Use medical standards where appropriate.
If the question is in Arabic, respond in clear, professional Arabic medical terminology.
        `;
      } else if (type === "diagnostic_support") {
        targetPrompt = `
You are a Senior Diagnostic Specialist AI. 
Analyze the following patient symptoms/query and provide a structured differential diagnosis support.
Query: "${data.query}"

Please provide:
1. Differential Diagnosis (التشخيص التفريقي): 3-5 possible conditions ranked by likelihood.
2. Clinical Red Flags (علامات الخطر): Immediate warnings based on symptoms.
3. Recommended Workup (الفحوصات المقترحة): Labs, imaging, or physical exam maneuvers.
4. Triage Level (مستوى الفرز): Suggested urgency level.

Format in clean Markdown. Language: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      } else if (type === "sbar_handover") {
        targetPrompt = `
You are a Clinical Liaison AI. Generate a professional SBAR (Situation, Background, Assessment, Recommendation) handover summary based on the provided context.
Context: "${data.query}"

Format in clean Markdown with bold SBAR headers. Language: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      } else {
        targetPrompt = `
You are a Clinical Quality and Patient Safety AI expert.
Analyze the following medical clinical tool audit / findings:
${JSON.stringify(data, null, 2)}

Provide a professional clinical review, safety assessment, potential risk markers, and recommendations formatted in clean Markdown.
The language of the response MUST be: ${lang === "ar" ? "Arabic" : "English"}.
        `;
      }

      // Retry logic
      let response;
      let lastError;
      for (let i = 0; i < 3; i++) {
        try {
          response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: targetPrompt,
            config: {
              temperature: 0.3,
            },
          });
          break;
        } catch (err: any) {
          lastError = err;
          // Wait before retrying if 503
          if (err.status === 503 || err.message?.includes("503") || err.message?.includes("high demand") || err.message?.includes("UNAVAILABLE")) {
            await new Promise(resolve => setTimeout(resolve, 1500 * (i + 1))); // Incremental backoff
            continue;
          }
          throw err; // Don't retry other errors
        }
      }

      if (!response) throw lastError;

      const text = response.text || "";
      res.json({ success: true, analysis: text });
    } catch (error: any) {
      console.log("Clinical Safety AI Model offline fallback activated.");
      let text = "";
      if (type === "news2") {
        text = getNews2Fallback(data, isAr);
      } else if (type === "isbar") {
        text = getIsbarFallback(data, isAr);
      } else if (type === "department_insights") {
        text = getDepartmentInsightsFallback(data, isAr);
      } else if (type === "department_chat") {
        text = getDepartmentChatFallback(data, isAr);
      } else if (type === "diagnostic_support") {
        text = isAr 
          ? `### 🩺 نظام التشخيص الاحتياطي\n\nأنا في وضع عدم الاتصال حالياً. بناءً على وصفك: "${data.query}"، يرجى إجراء فحص سريري شامل ومراجعة بروتوكولات الفرز (Triage) المعتمدة. استشر الطبيب الأخصائي فوراً إذا كانت هناك علامات خطر.`
          : `### 🩺 Offline Diagnostic Support\n\nI am currently offline. Regarding your query: "${data.query}", please perform a full clinical examination and follow established Triage protocols. Consult the attending physician immediately if red flags are present.`;
      } else if (type === "sbar_handover") {
        text = isAr
          ? `### 📋 ملخص SBAR احتياطي\n\n**الوضع:** ${data.query}\n\n*ملاحظة: هذا ملخص مبسط لأن النظام في وضع عدم الاتصال. يرجى إكمال التقرير يدوياً.*`
          : `### 📋 Offline SBAR Summary\n\n**Situation:** ${data.query}\n\n*Note: This is a simplified summary as the system is offline. Please complete the handover manually.*`;
      } else {
        text = isAr 
          ? `### 📋 تدقيق سريري احتياطي\n\n**البيانات المستلمة:**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nنظام التحليل الفوري قيد الصيانة التلقائية حالياً. يرجى مراجعة المعايير السريرية يدوياً.`
          : `### 📋 Offline Backup Clinical Audit\n\n**Received Data:**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nLive AI analysis model is currently undergoing automatic maintenance. Please review parameters manually according to hospital protocol.`;
      }
      res.json({ success: true, analysis: text, fallback: true });
    }
  });

  // Simple ping endpoint for connectivity test
  app.get("/api/ping", (req, res) => {
    res.json({ success: true, timestamp: Date.now() });
  });

  app.get("/api/consumables", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("consumables");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

      app.post("/api/inventory/add", async (req, res) => {
        try {
          const data = req.body;
          await clinicalDataService.saveItem("inventory", data);
          res.json({ success: true, data });
        } catch (e) {
          res.status(500).json({ error: (e as Error).message });
        }
      });

  app.get("/api/inventory", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("inventory");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("events");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/patients/:id/consumables", async (req, res) => {
    try {
      const patientId = req.params.id;
      const patients = await clinicalDataService.getCollection("patients");
      const patient = patients.find(p => p.id === patientId);
      if (!patient) return res.status(404).json({ error: "Patient not found" });

      const allConsumables = await clinicalDataService.getCollection("consumables");
      const patientConsumables = allConsumables.filter(c => c.patientId === patientId);

      const inventory = await clinicalDataService.getCollection("inventory");

      res.json({ patient, consumables: patientConsumables, inventory });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/consumables/issue", async (req, res) => {
    try {
      const { patientId, itemName, quantity, store } = req.body;
      const id = Date.now().toString();
      const transactionNo = `TXN-${id}`;
      const transactionDate = new Date().toISOString();
      const newConsumable = {
        id,
        patientId,
        itemName,
        transactionNo,
        store,
        quantity: parseFloat(quantity),
        status: "Confirmed",
        transactionDate
      };
      await clinicalDataService.saveItem("consumables", newConsumable);

      // Deduct inventory
      const inventory = await clinicalDataService.getCollection("inventory");
      let invItem = inventory.find(i => i.itemName === itemName && i.store === store);
      if (invItem) {
        invItem.currentQuantity = (parseFloat(invItem.currentQuantity) - parseFloat(quantity)).toString();
        invItem.lastUpdated = transactionDate;
        await clinicalDataService.saveItem("inventory", invItem);
      }

      // Add event
      const event = {
        id: Date.now().toString() + Math.random().toString().slice(2, 6),
        eventType: "CONSUMABLE_ISSUED",
        patientId,
        payload: { consumable: newConsumable, transactionNo },
        createdAt: transactionDate
      };
      await clinicalDataService.saveItem("events", event);

      res.json({ success: true, data: newConsumable });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // --- UNIVERSAL ABSTRACTION DATABASE LAYER (In-Memory Server-Side Store -> File Persisted) ---
  const DB_FILE_PATH = path.join(process.cwd(), "hospital_fallback_database.json");
  let providerStores: Record<string, Record<string, any[]>> = {
    SUPABASE: {},
    POCKETBASE: {},
    LOCAL_HOST: {},
    APPWRITE: {}
  };

  // Load persistent file if it exists
  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const savedData = JSON.parse(fs.readFileSync(DB_FILE_PATH, "utf8"));
      // merge preserved data
      providerStores = { ...providerStores, ...savedData };
      console.log("✅ Success: Persistent fallback database loaded from disk.");
    } catch (e) {
      console.error("Warning: Failed to parse fallback database JSON", e);
    }
  }

  function persistFallbackDatabase() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(providerStores, null, 2));
    } catch (e) {
      console.error("Warning: Failed to save fallback database to disk", e);
    }
  }

  let sseClients: express.Response[] = [];

  // Stream endpoint for Real-Time Event System
  app.get("/api/db/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Content-Encoding", "none");
    res.flushHeaders();

    // Send initial keep-alive comment to flush headers through proxy
    res.write(":\n\n");

    sseClients.push(res);

    req.on("close", () => {
      sseClients = sseClients.filter(client => client !== res);
    });
  });

  function broadcastUpdate(provider: string, collectionName: string) {
    const payload = JSON.stringify({ provider, collectionName, timestamp: new Date().toISOString() });
    sseClients.forEach(client => {
      try {
        client.write(`data: ${payload}\n\n`);
      } catch (err) {
        console.error("SSE write error:", err);
      }
    });
  }

  // Removed duplicate bulk-sync endpoint

  // Get all items in a collection for a given provider
  app.get("/api/db/:provider/:collection", async (req, res) => {
    const { collection: collectionName } = req.params;
    
    try {
      const data = await clinicalDataService.getCollection(collectionName);
      return res.json({ success: true, data });
    } catch (err: any) {
      console.error(`Error fetching collection ${collectionName} from PostgreSQL:`, err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Bulk Save/Update items in a collection
  app.post("/api/db/:provider/:collection/bulk", async (req, res) => {
    const { collection: collectionName } = req.params;
    const items = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "Body must be an array of items." });
    }

    try {
      for (const item of items) {
        if (item && item.id) {
          await clinicalDataService.saveItem(collectionName, item);
        }
      }
      broadcastUpdate("LOCAL_HOST", collectionName);
      return res.json({ success: true, count: items.length });
    } catch (err: any) {
      console.error(`Error bulk saving ${collectionName} to PostgreSQL:`, err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save/Update an item in a collection
  app.post("/api/db/:provider/:collection", async (req, res) => {
    const { collection: collectionName } = req.params;
    const item = req.body;

    if (!item || !item.id) {
      return res.status(400).json({ success: false, error: "Item must contain an 'id' field." });
    }

    try {
      await clinicalDataService.saveItem(collectionName, item);
      broadcastUpdate("LOCAL_HOST", collectionName);
      return res.json({ success: true, item });
    } catch (err: any) {
      console.error(`Error saving ${collectionName} to PostgreSQL:`, err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete an item from a collection
  app.delete("/api/db/:provider/:collection/:id", async (req, res) => {
    const { collection: collectionName, id } = req.params;

    try {
      await clinicalDataService.deleteItem(collectionName, id);
      broadcastUpdate("LOCAL_HOST", collectionName);
      return res.json({ success: true });
    } catch (err: any) {
      console.error(`Error deleting ${id} from ${collectionName} in PostgreSQL:`, err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API routes

  app.get("/api/patients", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("patients");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patient = req.body;
      await clinicalDataService.saveItem("patients", patient);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.delete("/api/patients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await clinicalDataService.deleteItem("patients", id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/prescriptions", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("prescriptions");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/prescriptions", async (req, res) => {
    try {
      const p = req.body;
      await clinicalDataService.saveItem("prescriptions", p);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/invoices", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("invoices");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const i = req.body;
      await clinicalDataService.saveItem("invoices", i);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const n = req.body;
      await clinicalDataService.saveItem("notifications", n);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/notifications", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("notifications");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/notifications/clear", async (req, res) => {
    try {
      const { ids } = req.body;
      if (ids && ids.length > 0) {
        for (const id of ids) {
          await clinicalDataService.deleteItem("notifications", id);
        }
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const data = await clinicalDataService.getCollection("messages");
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const m = req.body;
      await clinicalDataService.saveItem("messages", m);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/messages/clear", async (req, res) => {
    try {
      const { ids } = req.body;
      if (ids && ids.length > 0) {
        for (const id of ids) {
          await clinicalDataService.deleteItem("messages", id);
        }
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const data = await clinicalDataService.getCollection("settings");
      const matched = data.find((r: any) => r.key === key || r.id === key);
      res.json(matched || null);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const s = req.body;
      await clinicalDataService.saveItem("settings", s);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    // On Vercel, the dist folder is included. 
    // If bundled into dist/server.cjs, __dirname is dist.
    const distPath = process.env.VERCEL 
      ? path.join(process.cwd(), "dist")
      : path.join(process.cwd(), "dist");
    
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      console.log(`Serving static files from ${distPath}`);
    } else {
      console.warn(`Warning: dist folder not found at ${distPath}`);
      app.get("*", (req, res) => {
        res.status(404).send("Application dist folder not found. Please run build first.");
      });
    }
  }

  // --- Auto Seeding for PostgreSQL on Boot ---
  try {
    console.log("Checking if PostgreSQL database needs seeding...");
    
    // 1. Seed users
    const existingUsers = await db.select().from(collectionsStore).where(eq(collectionsStore.collectionName, "users"));
    if (existingUsers.length === 0) {
      console.log("Seeding system users to collectionsStore table...");
      const mockUsers = [
        {
          id: "user-it",
          nameAr: "م. عادل الشريف (رئيس قسم نظم المعلومات IT)",
          nameEn: "Eng. Adel El-Sherif (Head of IT & Digital Systems)",
          role: "it",
          avatarInitials: "IT",
          department: "INFORMATION TECHNOLOGY / IT",
          staffId: "2026",
          pin: "2026",
          email: "it-support@baheya.org",
          supervisorId: "user-admin",
        },
        {
          id: "user-nurse",
          nameAr: "أ. فاطمة الزهراء (استاف التمريض)",
          nameEn: "Sister Fatima El-Zahraa (Staff Nurse)",
          role: "staff",
          avatarInitials: "FZ",
          department: "EMERGENCY UNIT",
          staffId: "2525",
          pin: "2525",
          email: "fatima@baheya.org",
          supervisorId: "user-head-nurse",
        }
      ];
      for (const u of mockUsers) {
        await db.insert(collectionsStore).values({
          id: u.id,
          collectionName: "users",
          data: u,
          updatedAt: new Date().toISOString()
        });
      }
      console.log("System users seeded.");
    }

    // Patient seeding disabled for Production
  } catch (seedError) {
    console.error("Auto-seeding warning (non-fatal):", seedError);
  }

  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
  return app;
}

export { startServer };

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  startServer().then(app => {
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
        app.listen(3000, "0.0.0.0", () => {
            console.log(`Server running on http://0.0.0.0:3000`);
        });
    }
  }).catch((err) => {
    console.error("Failed to start server:", err);
  });
}

