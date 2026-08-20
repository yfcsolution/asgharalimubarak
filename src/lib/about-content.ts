/** Toggle extended professional timeline after client verification. */
export const SHOW_EXTENDED_PROFILE = false;

export const ABOUT_TITLE = "About AAM News & Contact";
export const ABOUT_TITLE_UR = "اے اے ایم نیوز کا تعارف اور رابطہ";

export const ABOUT_INTRO_EN =
  "Asghar Ali Mubarak (AAM News) is an independent bilingual Pakistani digital news platform committed to providing factual, timely and responsible news in English and Urdu.";

export const ABOUT_INTRO_UR =
  "اصغر علی مبارک (عام نیوز - AAM News) ایک آزاد دو لسانی پاکستانی ڈیجیٹل نیوز پلیٹ فارم ہے جو انگریزی اور اردو میں بروقت، مستند اور ذمہ دارانہ خبریں فراہم کرتا ہے۔";

export const ABOUT_COMMITMENT_EN =
  "The platform covers Pakistan and international affairs, politics, diplomacy, defence, economy, business, sports, health, education, science and technology, culture, society and other matters of public interest. AAM News aims to serve readers with clear, responsible and accessible journalism for a new generation of audiences.";

export const ABOUT_COMMITMENT_UR =
  "یہ پلیٹ فارم پاکستان اور عالمی امور، سیاست، سفارت کاری، دفاع، معیشت، کاروبار، کھیل، صحت، تعلیم، سائنس و ٹیکنالوجی، ثقافت، معاشرت اور دیگر عوامی امور کا احاطہ کرتا ہے۔ AAM News کا مقصد نئی نسل کے قارئین کے لیے واضح، ذمہ دارانہ اور قابل اعتماد صحافت پیش کرنا ہے۔";

export const MISSION_EN =
  "Our mission is to inform readers through factual reporting, responsible commentary and accessible bilingual journalism. AAM News aims to explain important developments clearly while maintaining independence, fairness and respect for the public interest.";

export const MISSION_UR =
  "ہمارا مقصد حقائق پر مبنی رپورٹنگ، ذمہ دارانہ تبصرے اور قابلِ فہم دو لسانی صحافت کے ذریعے قارئین کو باخبر رکھنا ہے۔ اے اے ایم نیوز اہم قومی و بین الاقوامی پیش رفت کو آزادی، توازن اور عوامی مفاد کے اصولوں کے تحت واضح انداز میں پیش کرنے کی کوشش کرتا ہے۔";

/**
 * TODO: confirm professional biography claims with the client before final publication.
 * Source: client-supplied biography. Present as structured professional summary only.
 * Do not invent achievements or treat unverified claims as confirmed facts.
 */
export const PROFESSIONAL_PROFILE_SUMMARY =
  "Asghar Ali Mubarak is a Pakistan-based journalist and diplomatic reporter associated with The Daily Mail International, Islamabad. His reporting and commentary cover diplomacy, politics, public affairs, sports and national and international developments. According to the professional information supplied by the client, he began his journalism career with Pakistan Press Agency and has participated in journalistic, academic, social, literary and sporting activities. He is also identified as the founder president of the Diplomatic Correspondents Forum of Pakistan. The client-supplied biography also describes participation in electoral politics, social welfare organizations, teaching and writing. These details are presented here as a structured professional profile and are not exaggerated.";

export const PUBLICATIONS_SUMMARY =
  "Client-supplied materials also reference literary and educational writing, including titles such as Uks-e-Khushboo and Qiamat Sey Pehlay Qiamat, as well as criminology educational material. Publication details should be confirmed with the client before being treated as a complete bibliography.";

export const CORRECTIONS_EN =
  "Readers may contact AAM News to report a factual error, provide a correction, share a news tip or request clarification. Submissions will be reviewed in accordance with editorial relevance and available information.";

export const CORRECTIONS_UR =
  "قارئین کسی حقیقتی غلطی کی نشاندہی، تصحیح، خبر کی اطلاع یا وضاحت کی درخواست کے لیے اے اے ایم نیوز سے رابطہ کر سکتے ہیں۔ موصول ہونے والی معلومات کا جائزہ ادارتی اہمیت اور دستیاب شواہد کی بنیاد پر لیا جائے گا۔";

export const CONTACT_INTRO =
  "For news tips, interviews, corrections, professional inquiries and general correspondence, use the contact details below.";

export const AUTHOR_ROLE = "Journalist and Editor";

export const FOOTER_DESCRIPTION_EN =
  "Asghar Ali Mubarak (AAM News) is an independent Pakistani bilingual digital news platform providing factual and timely news in English and Urdu across Pakistan, politics, sports, economy, diplomacy, defence, health, education, science and technology, and other public affairs.";

export const FOOTER_DESCRIPTION_UR =
  "اصغر علی مبارک (AAM News) ایک آزاد دو لسانی پاکستانی ڈیجیٹل نیوز پلیٹ فارم ہے جو انگریزی اور اردو میں بروقت اور مستند خبریں فراہم کرتا ہے۔";

/** Extended timeline groups — shown only when SHOW_EXTENDED_PROFILE is true. */
export const EXTENDED_PROFILE_GROUPS = [
  {
    title: "Journalism",
    items: [
      "Diplomatic reporter",
      "Association with The Daily Mail International",
      "Pakistan Press Agency career history",
      "Diplomatic Correspondents Forum of Pakistan",
    ],
  },
  {
    title: "Education",
    items: [
      "University of the Punjab",
      "Law",
      "Political Science",
      "History",
      "Business Administration",
      "Islamic Studies",
      "Mass Communication",
    ],
  },
  {
    title: "Public and Social Service",
    items: [
      "Social welfare",
      "Consumer rights",
      "Health organizations",
      "Literary organizations",
      "Youth and student organizations",
    ],
  },
  {
    title: "Sports",
    items: [
      "Sports reporting",
      "Sports administration",
      "Bodybuilding association",
      "Athlete and sports-community involvement",
    ],
  },
  {
    title: "Politics",
    items: ["Electoral participation"],
  },
  {
    title: "Publications",
    items: [
      "Uks-e-Khushboo",
      "Qiamat Sey Pehlay Qiamat",
      "Criminology educational material",
    ],
  },
] as const;
