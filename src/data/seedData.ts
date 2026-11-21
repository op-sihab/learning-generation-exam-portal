import {
  Notice,
  Maintenance,
  User,
  Course,
  Exam,
  LeaderboardEntry,
  ExamResult
} from "../types";

export const DEFAULT_NOTICE: Notice = {
	title: "নতুন মডেল টেস্ট ও অ্যানালিটিক্স যুক্ত হয়েছে",
	message: "SSC 26/27, ACS COMPACT GST এবং SUST-RU-BUP ব্যাচের নতুন অধ্যায়ভিত্তিক পরীক্ষা, প্র্যাকটিস মোড এবং বিস্তারিত ফলাফল বিশ্লেষণ এখন চালু আছে।",
	updatedAt: "2026-11-18T10:00:00Z"
};
export const DEFAULT_MAINTENANCE: Maintenance = {
	enabled: false,
	message: "নতুন প্রশ্নব্যাংক ও সার্ভার আপগ্রেডের কাজ চলছে। খুব শীঘ্রই পরীক্ষা পোর্টাল আবার চালু হবে।",
	expectedTime: "৩০ মিনিট পর",
	enabledAt: (new Date()).toISOString()
};
export const DEFAULT_USERS: Record<string, User> = {
	"demo@lg.com": {
		name: "তানভীর আহমেদ",
		email: "demo@lg.com",
		password: "123456",
		role: "student",
		targetBatch: "SSC 26/27 Premium Batch",
		dailyGoalExams: 2,
		photo: null,
		createdAt: "2026-09-01T08:00:00Z"
	},
	"admin@lg.com": {
		name: "অ্যাডমিন ইনস্ট্রাক্টর",
		email: "admin@lg.com",
		password: "admin123",
		role: "admin",
		targetBatch: "ACS COMPACT GST 2025",
		dailyGoalExams: 3,
		photo: null,
		createdAt: "2026-08-15T08:00:00Z"
	}
};
export const DEFAULT_COURSES: Course[] = [
	{
		id: "frpb",
		name: "SSC 26/27 Premium Batch",
		sub: "বিজ্ঞান বিভাগ · সম্পূর্ণ প্রস্তুতি",
		desc: "বোর্ড পরীক্ষা ও শীর্ষ কলেজ ভর্তির জন্য অধ্যায়ভিত্তিক সৃজনশীল MCQ, লাইভ মডেল টেস্ট ও বিস্তারিত ব্যাখ্যা।",
		artwork: "biology",
		instructor: "ডা. রাকিবুল হাসান ও টিম",
		enrolledCount: 4820,
		subjects: [
			{
				id: "sbio",
				name: "জীববিজ্ঞান",
				code: "BIO-138",
				chapters: [
					"জীবন বৈচিত্র্য",
					"কোষ ও এর গঠন",
					"কোষ বিভাজন",
					"রেচন প্রক্রিয়া",
					"চলন ও অঙ্গচালনা"
				]
			},
			{
				id: "schem",
				name: "রসায়ন",
				code: "CHEM-137",
				chapters: [
					"পদার্থের অবস্থা",
					"পদার্থের গঠন",
					"রাসায়নিক বন্ধন",
					"মোল ও রাসায়নিক গণনা"
				]
			},
			{
				id: "sphy",
				name: "পদার্থবিজ্ঞান",
				code: "PHY-136",
				chapters: [
					"ভৌত রাশি ও পরিমাপ",
					"গতি",
					"বল",
					"কাজ, ক্ষমতা ও শক্তি"
				]
			}
		]
	},
	{
		id: "frb",
		name: "ACS COMPACT GST 2025",
		sub: "গুচ্ছ বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি",
		desc: "সমন্বিত GST বিজ্ঞান ইউনিটের সর্বশেষ সিলেবাস অনুযায়ী হাই-ইয়েল্ড শর্টকাট, টাইমড মডেল টেস্ট ও মেরিট র‍্যাংকিং।",
		artwork: "chemistry",
		instructor: "ইঞ্জি. মাহফুজুর রহমান",
		enrolledCount: 6390,
		subjects: [{
			id: "sbioh",
			name: "জীববিজ্ঞান ১ম পত্র",
			code: "BIO-178",
			chapters: [
				"কোষ ও এর গঠন",
				"কোষ বিভাজন",
				"জিনতত্ত্ব ও বিবর্তন"
			]
		}, {
			id: "smath",
			name: "উচ্চতর গণিত",
			code: "MATH-265",
			chapters: [
				"ম্যাট্রিক্স ও নির্ণায়ক",
				"সরলরেখা",
				"অন্তরীকরণ"
			]
		}]
	},
	{
		id: "frbp",
		name: "SUST, RU, BUP এক্সাম ব্যাচ-২০২৫",
		sub: "ভার্সিটি ফাইনাল রিভিশন",
		desc: "বিগত বছরের প্রশ্ন বিশ্লেষণ ও নেগেটিভ মার্কিং নিয়ন্ত্রণের জন্য বিশেষ এক্সাম ব্যাচ ও র‍্যাপিড রিভিশন ড্রিল।",
		artwork: "admission",
		instructor: "সাদিয়া নওশীন ও ফ্যাকাল্টি",
		enrolledCount: 3150,
		subjects: [{
			id: "sbiorev",
			name: "জীববিজ্ঞান রিভিশন",
			code: "REV-BIO",
			chapters: ["রেচন প্রক্রিয়া ও বৃক্ক", "রক্ত ও সংবহন"]
		}, {
			id: "seng",
			name: "ইংরেজি গ্রামার ও ভোকাবুলারি",
			code: "ENG-101",
			chapters: ["Parts of Speech & Clauses", "Appropriate Prepositions"]
		}]
	}
];
export const DEFAULT_EXAMS: Exam[] = [
	{
		id: "e1",
		name: "মডেল টেস্ট-২৭: রেচন প্রক্রিয়া (সম্পূর্ণ অধ্যায়)",
		courseId: "frpb",
		subject: "জীববিজ্ঞান",
		chapter: "রেচন প্রক্রিয়া",
		type: "Model Test",
		minutes: 15,
		marks: 1,
		negative: .25,
		startTime: "2026-01-01T08:00",
		endTime: "2027-12-31T23:59",
		retakeAllowed: true,
		published: true,
		instructions: [
			"পরীক্ষার মোট সময় ১৫ মিনিট। সময় শেষ হলে স্বয়ংক্রিয়ভাবে উত্তরপত্র জমা হবে।",
			"প্রতিটি সঠিক উত্তরের জন্য ১.০ নম্বর এবং প্রতিটি ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে।",
			"লাইভ মোডে অন্য ট্যাবে গেলে বা স্ক্রিন পরিবর্তন করলে সতর্কতা রেকর্ড হবে।",
			"কিবোর্ড শর্টকাট (১-৪ উত্তর নির্বাচন, ←/→ নেভিগেশন, M মার্ক) ব্যবহার করা যাবে।"
		],
		questions: [
			{
				id: "q1",
				text: "একজন সুস্থ প্রাপ্তবয়স্ক মানুষ প্রতিদিন গড়ে প্রায় কত লিটার মূত্র ত্যাগ করে?",
				options: [
					"০.৫ লিটার",
					"১.৫ লিটার",
					"৩.০ লিটার",
					"৪.৫ লিটার"
				],
				answer: 1,
				explanation: "একজন স্বাভাবিক সুস্থ মানুষ দৈনিক গড়ে প্রায় ১.২ থেকে ১.৫ লিটার মূত্র ত্যাগ করে, যার প্রায় ৯০% পানি।",
				difficulty: "easy",
				topic: "মানব রেচনতন্ত্র"
			},
			{
				id: "q2",
				text: "নিচের কোন খাদ্যটি গ্রহণ করলে ক্ষারীয় মূত্র তৈরি হয়?",
				options: [
					"আপেল ও ফলমূল",
					"চিনাবাদাম",
					"কাতল মাছ",
					"গরুর মাংস"
				],
				answer: 0,
				explanation: "আমিষ জাতীয় খাদ্য (মাছ, মাংস, ডিম) অম্লীয় মূত্র তৈরি করে, আর ফলমূল ও শাকসবজি ক্ষারীয় মূত্র তৈরি করে।",
				difficulty: "medium",
				topic: "মূত্রের উপাদান"
			},
			{
				id: "q3",
				text: "বৃক্ককে ঘিরে থাকা তন্তুময় যোজক কলার আবরণীকে কী বলা হয়?",
				options: [
					"মেডুলা",
					"কর্টেক্স",
					"রেনাল ক্যাপসুল",
					"হাইলাম"
				],
				answer: 2,
				explanation: "বৃক্কের বাইরের দিকের তন্তুময় যোজক কলা নির্মিত শক্ত আবরণটিকে রেনাল ক্যাপসুল (Renal Capsule) বলা হয়।",
				difficulty: "easy",
				topic: "বৃক্কের গঠন"
			},
			{
				id: "q4",
				text: "বৃক্কে রক্ত পরিশ্রাবণের ক্ষেত্রে ছাঁকনির মতো কাজ করে কোনটি?",
				options: [
					"গ্লোমেরুলাস",
					"পেলভিস",
					"ইউরেটার",
					"সংগ্রাহী নালিকা"
				],
				answer: 0,
				explanation: "বোম্যানস ক্যাপসুলের ভেতর থাকা কৈশিক জালিকার গুচ্ছ গ্লোমেরুলাস অতিপরিস্রাবণের মাধ্যমে ছাঁকনি হিসেবে কাজ করে।",
				difficulty: "easy",
				topic: "নেফ্রন"
			},
			{
				id: "q5",
				text: "মানবদেহের দুটি বৃক্কে মোট প্রায় কতটি নেফ্রন থাকে?",
				options: [
					"১০–১২ লক্ষ",
					"২০–২৪ লক্ষ",
					"৩০–৩৫ লক্ষ",
					"৫০–৬০ লক্ষ"
				],
				answer: 1,
				explanation: "মানবদেহের প্রতিটি বৃক্কে ১০ থেকে ১২ লক্ষ নেফ্রন থাকে। অর্থাৎ দুটি বৃক্কে মোট ২০ থেকে ২৪ লক্ষ নেফ্রন থাকে।",
				difficulty: "medium",
				topic: "নেফ্রন"
			},
			{
				id: "q6",
				text: "মূত্রের রঙ হালকা হলুদ হয় কোন রঞ্জক পদার্থের উপস্থিতির কারণে?",
				options: [
					"হিমোগ্লোবিন",
					"ইউরোক্রোম",
					"বিলিরুবিন",
					"মেলানিন"
				],
				answer: 1,
				explanation: "ইউরোক্রোম (Urochrome) নামক রঞ্জক পদার্থের কারণে স্বাভাবিক মূত্রের রঙ হালকা খড় বা হলুদ বর্ণের হয়।",
				difficulty: "easy",
				topic: "মূত্রের উপাদান"
			},
			{
				id: "q7",
				text: "কোন হরমোনটি বৃক্কে পানির পুনঃশোষণ নিয়ন্ত্রণ করে অসমোরেগুলেশন বজায় রাখে?",
				options: [
					"ইনসুলিন",
					"অ্যান্টি-ডাইইউরেটিক হরমোন (ADH)",
					"অ্যাড্রেনালিন",
					"থাইরক্সিন"
				],
				answer: 1,
				explanation: "পশ্চাৎ পিটুইটারি থেকে নিঃসৃত ADH বা ভ্যাসোপ্রেসিন হরমোন নেফ্রনের দূরবর্তী নালিকা ও সংগ্রাহী নালিকায় পানির পুনঃশোষণ নিয়ন্ত্রণ করে।",
				difficulty: "hard",
				topic: "অসমোরেগুলেশন"
			},
			{
				id: "q8",
				text: "বৃক্কের অবতল অংশের যে ভাঁজ দিয়ে ইউরেটার ও রেনাল শিরা বের হয়, তাকে কী বলে?",
				options: [
					"পেলভিস",
					"প্যাপিলা",
					"হাইলাম (হাইলাস)",
					"ক্যালিক্স"
				],
				answer: 2,
				explanation: "বৃক্কের ভেতরের দিকের অবতল ভাঁজকে হাইলাম বা হাইলাস বলে। এখান দিয়ে ইউরেটার ও রেনাল শিরা বের হয় এবং রেনাল ধমনী প্রবেশ করে।",
				difficulty: "medium",
				topic: "বৃক্কের গঠন"
			}
		]
	},
	{
		id: "e2",
		name: "রসায়ন স্পেশাল: রাসায়নিক বন্ধন ও আয়নিক যৌগ",
		courseId: "frpb",
		subject: "রসায়ন",
		chapter: "রাসায়নিক বন্ধন",
		type: "MCQ",
		minutes: 12,
		marks: 1,
		negative: .25,
		startTime: "2026-01-01T08:00",
		endTime: "2027-12-31T23:59",
		retakeAllowed: true,
		published: true,
		instructions: [
			"প্রতিটি প্রশ্নে ৪টি অপশন থাকবে, সঠিক উত্তর নির্বাচন করো।",
			"ভুল উত্তরের জন্য ০.২৫ নেগেটিভ মার্কিং প্রযোজ্য।",
			"প্র্যাকটিস মোডে প্রতিটি উত্তরের সাথে সাথে ব্যাখ্যা দেখতে পারবে।"
		],
		questions: [
			{
				id: "c1",
				text: "নিচের কোন যৌগটিতে সমযোজী ও আয়নিক উভয় ধরনের বন্ধন বিদ্যমান?",
				questionType: "mcq",
				options: [
					"$\\ce{NaCl}$",
					"$\\ce{NH4Cl}$",
					"$\\ce{CH4}$",
					"$\\ce{CO2}$"
				],
				answer: 1,
				explanation: "$\\ce{NH4Cl}$ যৌগে $\\ce{NH4+}$ আয়নের ভেতরে সমযোজী ও সন্নিবেশ বন্ধন এবং $\\ce{NH4+}$ ও $\\ce{Cl-}$ এর মধ্যে আয়নিক বন্ধন থাকে।",
				subject: "রসায়ন",
				chapter: "রাসায়নিক বন্ধন",
				difficulty: "medium",
				topic: "বন্ধনের প্রকারভেদ",
				formulas: [
					"\\ce{NaCl}",
					"\\ce{NH4Cl}",
					"\\ce{CH4}",
					"\\ce{CO2}",
					"\\ce{NH4+}",
					"\\ce{Cl-}"
				],
				formulaSource: "\\ce{NH4Cl}"
			},
			{
				id: "c2",
				text: "পানির অণুতে ($\\ce{H2O}$) নিঃসঙ্গ ইলেকট্রন জোড়ের (Lone pair) সংখ্যা কয়টি?",
				questionType: "mcq",
				options: [
					"১টি",
					"২টি",
					"৩টি",
					"৪টি"
				],
				answer: 1,
				explanation: "অক্সিজেনের সর্বশেষ কক্ষপথে ৬টি ইলেকট্রন থাকে। ২টি হাইড্রোজেনের সাথে বন্ধন গঠনের পর $\\ce{2H2 + O2 -> 2H2O}$ গঠনে ২ জোড়া মুক্তজোড় ইলেকট্রন থাকে।",
				subject: "রসায়ন",
				chapter: "রাসায়নিক বন্ধন",
				difficulty: "easy",
				topic: "সমযোজী বন্ধন",
				formulas: ["\\ce{H2O}", "\\ce{2H2 + O2 -> 2H2O}"],
				formulaSource: "\\ce{2H2 + O2 -> 2H2O}"
			},
			{
				id: "c3",
				text: "নিচের কোন আয়ন জোড়াটি মিলে সোডিয়াম সালফেট ($\\ce{Na2SO4}$) গঠন করে?",
				questionType: "mcq",
				options: [
					"$\\ce{Na+}$ ও $\\ce{SO4^{2-}}$",
					"$\\ce{Na^{2+}}$ ও $\\ce{SO4-}$",
					"$\\ce{Na+}$ ও $\\ce{SO3^{2-}}$",
					"$\\ce{Na+}$ ও $\\ce{S^{2-}}$"
				],
				answer: 0,
				explanation: "দুটি সোডিয়াম আয়ন ($\\ce{Na+}$) ও একটি সালফেট আয়ন ($\\ce{SO4^{2-}}$) যুক্ত হয়ে নিরপেক্ষ $\\ce{Na2SO4}$ যৌগ গঠন করে।",
				subject: "রসায়ন",
				chapter: "রাসায়নিক বন্ধন",
				difficulty: "easy",
				topic: "আয়নিক যৌগ",
				formulas: [
					"\\ce{Na2SO4}",
					"\\ce{Na+}",
					"\\ce{SO4^{2-}}"
				],
				formulaSource: "\\ce{Na+}, \\ce{SO4^{2-}}"
			},
			{
				id: "c4",
				text: "আয়নিক যৌগ সাধারণত কোন দ্রাবকে দ্রবীভূত হয়?",
				questionType: "mcq",
				options: [
					"বেনজিন ($\\ce{C6H6}$)",
					"কার্বন টেট্রাক্লোরাইড ($\\ce{CCl4}$)",
					"পোলার দ্রাবক পানি ($\\ce{H2O}$)",
					"ইথার"
				],
				answer: 2,
				explanation: "আয়নিক যৌগের ধনাত্মক ও ঋণাত্মক আয়ন পোলার দ্রাবক পানির ($\\ce{H2O}$) বিপরীত মেরু দ্বারা আকৃষ্ট হয়ে সহজেই দ্রবীভূত হয়।",
				subject: "রসায়ন",
				chapter: "রাসায়নিক বন্ধন",
				difficulty: "easy",
				topic: "আয়নিক যৌগের ধর্ম",
				formulas: [
					"\\ce{C6H6}",
					"\\ce{CCl4}",
					"\\ce{H2O}"
				]
			},
			{
				id: "c5",
				text: "$\\ce{CO2}$ অণুতে মোট কয়টি সিগমা ($\\sigma$) এবং পাই ($\\pi$) বন্ধন রয়েছে?",
				questionType: "mcq",
				options: [
					"২টি $\\sigma$ ও ২টি $\\pi$",
					"২টি $\\sigma$ ও ১টি $\\pi$",
					"১টি $\\sigma$ ও ২টি $\\pi$",
					"৪টি $\\sigma$ ও ০টি $\\pi$"
				],
				answer: 0,
				explanation: "$\\ce{O=C=O}$ গঠনে দুটি দ্বিবন্ধন রয়েছে। প্রতিটি দ্বিবন্ধনে ১টি $\\sigma$ ও ১টি $\\pi$ বন্ধন থাকায় মোট ২টি $\\sigma$ এবং ২টি $\\pi$ বন্ধন থাকে।",
				subject: "রসায়ন",
				chapter: "রাসায়নিক বন্ধন",
				difficulty: "hard",
				topic: "অরবিটাল অধিক্রমণ",
				formulas: [
					"\\ce{CO2}",
					"\\sigma",
					"\\pi",
					"\\ce{O=C=O}"
				]
			},
			{
				id: "c6",
				text: "সালফারের সর্বোচ্চ পরিবর্তনশীল যোজনী কত?",
				questionType: "mcq",
				options: [
					"২",
					"৪",
					"৬",
					"৮"
				],
				answer: 2,
				explanation: "সালফার ($\\ce{S}$) এর পরিবর্তনশীল যোজনী ২, ৪ এবং ৬ (যেমন: $\\ce{H2S}$, $\\ce{SO2}$, $\\ce{H2SO4}$)।",
				subject: "রসায়ন",
				chapter: "রাসায়নিক বন্ধন",
				difficulty: "medium",
				topic: "যোজনী",
				formulas: [
					"\\ce{H2S}",
					"\\ce{SO2}",
					"\\ce{H2SO4}"
				]
			}
		]
	},
	{
		id: "e3",
		name: "পদার্থবিজ্ঞান: গতি ও নিউটনের বলবিদ্যা ড্রিল",
		courseId: "frpb",
		subject: "পদার্থবিজ্ঞান",
		chapter: "বল",
		type: "Quick Drill",
		minutes: 10,
		marks: 1,
		negative: .25,
		startTime: "2026-01-01T08:00",
		endTime: "2027-12-31T23:59",
		retakeAllowed: true,
		published: true,
		instructions: ["গাণিতিক সমস্যাগুলোর একক খেয়াল রেখে হিসাব করো।", "ক্যালকুলেটর ছাড়াই দ্রুত সমাধানের অভ্যাস গড়ে তোলো।"],
		questions: [
			{
				id: "p1",
				text: "$5\\text{ kg}$ ভরের একটি বস্তুর ওপর $\\vec{F} = 20\\text{ N}$ বল প্রয়োগ করলে এর ত্বরণ $a$ কত হবে?",
				questionType: "mcq",
				options: [
					"$2\\text{ m/s}^2$",
					"$4\\text{ m/s}^2$",
					"$10\\text{ m/s}^2$",
					"$100\\text{ m/s}^2$"
				],
				answer: 1,
				explanation: "নিউটনের দ্বিতীয় সূত্র অনুযায়ী, $F = ma \\Rightarrow a = \\frac{F}{m} = \\frac{20}{5} = 4\\text{ m/s}^2$।",
				subject: "পদার্থবিজ্ঞান",
				chapter: "বল",
				difficulty: "easy",
				topic: "নিউটনের ২য় সূত্র",
				formulas: ["F = ma", "a = \\frac{F}{m} = \\frac{20}{5} = 4\\text{ m/s}^2"],
				formulaSource: "F = ma"
			},
			{
				id: "p2",
				text: "বলের ঘাতের (Impulse, $\\vec{J} = \\vec{F}\\Delta t$) মাত্রা নিচের কোন রাশিটির মাত্রার সমান?",
				questionType: "mcq",
				options: [
					"কাজ ($W$)",
					"ভরবেগ ($\\vec{p}$)",
					"ক্ষমতা ($P$)",
					"ত্বরণ ($\\vec{a}$)"
				],
				answer: 1,
				explanation: "বলের ঘাত $\\vec{J} = \\vec{F}\\Delta t = \\Delta \\vec{p}$। তাই বলের ঘাত ও ভরবেগের মাত্রা $[MLT^{-1}]$ অভিন্ন।",
				subject: "পদার্থবিজ্ঞান",
				chapter: "বল",
				difficulty: "medium",
				topic: "ভরবেগ ও বলের ঘাত",
				formulas: ["\\vec{J} = \\vec{F}\\Delta t = \\Delta \\vec{p}", "[MLT^{-1}]"]
			},
			{
				id: "p3",
				text: "কোন মৌলিক বলটির পাল্লা (Range) অসীম ($\\infty$) কিন্তু আপেক্ষিক সবলতা সবচেয়ে কম?",
				questionType: "mcq",
				options: [
					"সবল নিউক্লীয় বল",
					"তাড়িতচৌম্বক বল",
					"দুর্বল নিউক্লীয় বল",
					"মহাকর্ষ বল"
				],
				answer: 3,
				explanation: "চারটি মৌলিক বলের মধ্যে মহাকর্ষ বল ($F = G\\frac{m_1 m_2}{r^2}$) এর পাল্লা অসীম হলেও এর আপেক্ষিক সবলতা সবচেয়ে কম।",
				subject: "পদার্থবিজ্ঞান",
				chapter: "বল",
				difficulty: "medium",
				topic: "মৌলিক বল",
				formulas: ["F = G\\frac{m_1 m_2}{r^2}"]
			},
			{
				id: "p4",
				text: "স্থির অবস্থান ($u = 0$) থেকে $a = 2\\text{ m/s}^2$ সুষম ত্বরণে চলা একটি গাড়ি $t = 10\\text{ s}$ সময়ে কত দূরত্ব অতিক্রম করবে?",
				questionType: "mcq",
				options: [
					"$20\\text{ m}$",
					"$50\\text{ m}$",
					"$100\\text{ m}$",
					"$200\\text{ m}$"
				],
				answer: 2,
				explanation: "গতির সমীকরণ অনুযায়ী, $s = ut + \\frac{1}{2}at^2 = 0 + \\frac{1}{2} \\times 2 \\times 10^2 = 100\\text{ m}$ এবং শেষবেগ $v = u + at = 20\\text{ m/s}$।",
				subject: "পদার্থবিজ্ঞান",
				chapter: "গতি",
				difficulty: "easy",
				topic: "গতির সমীকরণ",
				formulas: ["s = ut + \\frac{1}{2}at^2", "v = u + at"],
				formulaSource: "s = ut + \\frac{1}{2}at^2"
			},
			{
				id: "p5",
				text: "ঘর্ষণ বল ($f_k = \\mu_k N$) সর্বদা কোন দিকে ক্রিয়া করে?",
				questionType: "mcq",
				options: [
					"গতির দিকে",
					"গতির বিপরীত দিকে",
					"অভিলম্বের দিকে",
					"উপরের দিকে"
				],
				answer: 1,
				explanation: "ঘর্ষণ বল ($f_k = \\mu_k N$) সর্বদা দুটি স্পর্শতলের আপেক্ষিক গতির বা গতির প্রবণতার বিপরীত দিকে ক্রিয়া করে।",
				subject: "পদার্থবিজ্ঞান",
				chapter: "বল",
				difficulty: "easy",
				topic: "ঘর্ষণ",
				formulas: ["f_k = \\mu_k N"]
			}
		]
	},
	{
		id: "e4",
		name: "GST হাই-ইয়েল্ড: কোষ ও এর গঠন (১ম পত্র)",
		courseId: "frb",
		subject: "জীববিজ্ঞান ১ম পত্র",
		chapter: "কোষ ও এর গঠন",
		type: "Model Test",
		minutes: 15,
		marks: 1,
		negative: .25,
		startTime: "2026-01-01T08:00",
		endTime: "2027-12-31T23:59",
		retakeAllowed: true,
		published: true,
		instructions: ["গুচ্ছ ভর্তি পরীক্ষার স্ট্যান্ডার্ড মান অনুসরণ করে প্রশ্ন প্রণয়ন করা হয়েছে।", "প্রতিটি ভুল উত্তরে ০.২৫ নম্বর কর্তন করা হবে।"],
		questions: [
			{
				id: "gb1",
				text: "কোন কোষীয় অঙ্গাণুকে কোষের \"আত্মঘাতী থলিকা\" (Suicidal Bag) বলা হয়?",
				options: [
					"রাইবোসোম",
					"লাইসোসোম",
					"গলগি বডি",
					"পারঅক্সিসোম"
				],
				answer: 1,
				explanation: "লাইসোসোমে শক্তিশালী হাইড্রোলাইটিক এনজাইম থাকায় তীব্র খাদ্যাভাবে এটি নিজের কোষকেই পরিপাক (অটোফ্যাগি) করতে পারে।",
				difficulty: "easy",
				topic: "সাইটোপ্লাজমীয় অঙ্গাণু"
			},
			{
				id: "gb2",
				text: "প্লাজমামেমব্রেনের \"ফ্লুইড মোজাইক মডেল\" (Fluid Mosaic Model) কে প্রস্তাব করেন?",
				options: [
					"রবার্ট হুক",
					"সিঙ্গার ও নিকলসন",
					"রবার্টসন",
					"ড্যানিয়েলি ও ডেভসন"
				],
				answer: 1,
				explanation: "১৯৭২ সালে এস. জে. সিঙ্গার এবং জি. এল. নিকলসন কোষঝিল্লির সর্বজনগ্রাহ্য ফ্লুইড মোজাইক মডেল প্রদান করেন।",
				difficulty: "medium",
				topic: "কোষঝিল্লি"
			},
			{
				id: "gb3",
				text: "আদিকোষী (Prokaryotic) জীবে কোন ধরনের রাইবোসোম পাওয়া যায়?",
				options: [
					"80S",
					"70S",
					"60S",
					"90S"
				],
				answer: 1,
				explanation: "আদিকোষে 70S (50S + 30S উপ-একক) রাইবোসোম এবং প্রকৃতকোষে 80S রাইবোসোম থাকে।",
				difficulty: "easy",
				topic: "রাইবোসোম"
			},
			{
				id: "gb4",
				text: "DNA অণুতে অ্যাডেনিন (A) এবং থায়ামিনের (T) মধ্যে কয়টি হাইড্রোজেন বন্ধন থাকে?",
				options: [
					"১টি",
					"২টি",
					"৩টি",
					"৪টি"
				],
				answer: 1,
				explanation: "DNA ডাবল হেলিক্সে A=T (২টি হাইড্রোজেন বন্ধন) এবং G≡C (৩টি হাইড্রোজেন বন্ধন) দ্বারা যুক্ত থাকে।",
				difficulty: "easy",
				topic: "নিউক্লিক এসিড"
			},
			{
				id: "gb5",
				text: "মাইটোকন্ড্রিয়ার অন্তঃপর্দার ভেতরের দিকের আঙুলের মতো ভাঁজগুলোকে কী বলা হয়?",
				options: [
					"থাইলাকয়েড",
					"ক্রিস্টি",
					"গ্রানা",
					"সিস্টারনি"
				],
				answer: 1,
				explanation: "মাইটোকন্ড্রিয়ার অন্তঃপর্দা ভেতরের দিকে ভাঁজ হয়ে যে গঠন তৈরি করে তাকে ক্রিস্টি (Cristae) বলে।",
				difficulty: "easy",
				topic: "মাইটোকন্ড্রিয়া"
			},
			{
				id: "gb6",
				text: "RNA-তে থায়ামিনের (Thymine) পরিবর্তে কোন নাইট্রোজেন ক্ষারকটি থাকে?",
				options: [
					"গুয়ানিন",
					"সাইটোসিন",
					"ইউরাসিল",
					"অ্যাডেনিন"
				],
				answer: 2,
				explanation: "RNA-তে পিরিমিডিন ক্ষারক হিসেবে থায়ামিনের পরিবর্তে ইউরাসিল (Uracil) উপস্থিত থাকে।",
				difficulty: "easy",
				topic: "নিউক্লিক এসিড"
			}
		]
	},
	{
		id: "e5",
		name: "GST গণিত: ম্যাট্রিক্স ও সরলরেখা শর্টকাট টেস্ট",
		courseId: "frb",
		subject: "উচ্চতর গণিত",
		chapter: "সরলরেখা",
		type: "MCQ",
		minutes: 15,
		marks: 1,
		negative: .25,
		startTime: "2026-01-01T08:00",
		endTime: "2027-12-31T23:59",
		retakeAllowed: true,
		published: true,
		instructions: ["সরলরেখা ও ম্যাট্রিক্সের শর্টকাট ফর্মুলা প্রয়োগ করে দ্রুত উত্তর দাও।", "সঠিক উত্তর ১.০, ভুল উত্তর −০.২৫।"],
		questions: [
			{
				id: "m1",
				text: "$3x + 4y - 12 = 0$ সরলরেখাটি অক্ষদ্বয়ের সাথে যে ত্রিভুজ উৎপন্ন করে তার ক্ষেত্রফল কত বর্গ একক?",
				questionType: "mcq",
				options: [
					"৪",
					"৬",
					"১২",
					"২৪"
				],
				answer: 1,
				explanation: "$\\frac{x}{4} + \\frac{y}{3} = 1$ আকারে প্রকাশ করলে $a = 4$, $b = 3$। ক্ষেত্রফল $= \\frac{1}{2}|ab| = \\frac{1}{2} \\times 4 \\times 3 = 6$ বর্গ একক।",
				subject: "উচ্চতর গণিত",
				chapter: "সরলরেখা",
				difficulty: "medium",
				topic: "সরলরেখার খণ্ডিতাংশ",
				formulas: [
					"3x + 4y - 12 = 0",
					"\\frac{x}{4} + \\frac{y}{3} = 1",
					"\\frac{1}{2}|ab|"
				]
			},
			{
				id: "m2",
				text: "মূলবিন্দু $(0, 0)$ থেকে $3x + 4y - 10 = 0$ রেখার লম্ব দূরত্ব কত একক?",
				questionType: "mcq",
				options: [
					"১",
					"২",
					"৫",
					"১০"
				],
				answer: 1,
				explanation: "লম্ব দূরত্ব $d = \\frac{|-10|}{\\sqrt{3^2 + 4^2}} = \\frac{10}{5} = 2$ একক।",
				subject: "উচ্চতর গণিত",
				chapter: "সরলরেখা",
				difficulty: "easy",
				topic: "লম্ব দূরত্ব",
				formulas: ["d = \\frac{|-10|}{\\sqrt{3^2 + 4^2}} = 2"]
			},
			{
				id: "m3",
				text: "একটি বর্গ ম্যাট্রিক্স $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ ব্যতিক্রমী (Singular) হবে যদি এবং কেবল যদি—",
				questionType: "mcq",
				options: [
					"$|A| = 1$",
					"$|A| = 0$",
					"$|A| \\neq 0$",
					"$A^T = A$"
				],
				answer: 1,
				explanation: "কোনো বর্গ ম্যাট্রিক্সের নির্ণায়কের মান শূন্য ($|A| = ad - bc = 0$) হলে তাকে ব্যতিক্রমী বা Singular ম্যাট্রিক্স বলে।",
				subject: "উচ্চতর গণিত",
				chapter: "ম্যাট্রিক্স ও নির্ণায়ক",
				difficulty: "easy",
				topic: "ম্যাট্রিক্স",
				formulas: ["A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", "|A| = 0"]
			},
			{
				id: "m4",
				text: "$2x - 3y + 5 = 0$ রেখার লম্ব রেখার ঢাল (Slope) কত?",
				questionType: "mcq",
				options: [
					"$\\frac{2}{3}$",
					"$-\\frac{2}{3}$",
					"$-\\frac{3}{2}$",
					"$\\frac{3}{2}$"
				],
				answer: 2,
				explanation: "প্রদত্ত রেখার ঢাল $m_1 = \\frac{2}{3}$। লম্ব রেখার ঢাল $m_2 = -\\frac{1}{m_1} = -\\frac{3}{2}$।",
				subject: "উচ্চতর গণিত",
				chapter: "সরলরেখা",
				difficulty: "medium",
				topic: "সরলরেখার ঢাল",
				formulas: ["m_1 = \\frac{2}{3}", "m_2 = -\\frac{3}{2}"]
			},
			{
				id: "m5",
				text: "$\\frac{d}{dx}(\\ln(\\sin x))$ এর মান নিচের কোনটি?",
				questionType: "mcq",
				options: [
					"$\\tan x$",
					"$\\cot x$",
					"$\\sec x$",
					"$\\csc x$"
				],
				answer: 1,
				explanation: "চেইন রুল অনুযায়ী, $\\frac{d}{dx}(\\ln(\\sin x)) = \\frac{1}{\\sin x} \\cdot \\cos x = \\cot x$।",
				subject: "উচ্চতর গণিত",
				chapter: "অন্তরীকরণ",
				difficulty: "medium",
				topic: "অন্তরীকরণ",
				formulas: ["\\frac{d}{dx}(\\ln(\\sin x)) = \\cot x"]
			}
		]
	},
	{
		id: "e6",
		name: "SUST-RU-BUP ইংলিশ মাস্টার কুইজ: Preposition & Grammar",
		courseId: "frbp",
		subject: "ইংরেজি গ্রামার ও ভোকাবুলারি",
		chapter: "Appropriate Prepositions",
		type: "MCQ",
		minutes: 10,
		marks: 1,
		negative: .25,
		startTime: "2026-01-01T08:00",
		endTime: "2027-12-31T23:59",
		retakeAllowed: true,
		published: true,
		instructions: ["Read each sentence carefully and choose the most grammatically accurate option.", "Negative marking of 0.25 applies to every wrong answer."],
		questions: [
			{
				id: "en1",
				text: "He is completely absorbed ___ his research work.",
				options: [
					"at",
					"in",
					"with",
					"on"
				],
				answer: 1,
				explanation: "\"Absorbed in\" is the appropriate preposition meaning deeply engaged or engrossed in something.",
				difficulty: "easy",
				topic: "Appropriate Preposition"
			},
			{
				id: "en2",
				text: "Scarcely had we reached the station ___ the train departed.",
				options: [
					"than",
					"when",
					"then",
					"before"
				],
				answer: 1,
				explanation: "Correlative conjunction rule: \"Scarcely/Hardly ... when\" whereas \"No sooner ... than\".",
				difficulty: "medium",
				topic: "Correlative Conjunctions"
			},
			{
				id: "en3",
				text: "Choose the correct synonym of the word \"EPHEMERAL\":",
				options: [
					"Permanent",
					"Short-lived",
					"Enormous",
					"Mysterious"
				],
				answer: 1,
				explanation: "\"Ephemeral\" means lasting for a very short time (transitory / short-lived).",
				difficulty: "hard",
				topic: "Vocabulary"
			},
			{
				id: "en4",
				text: "Neither the teacher nor the students ___ present at the seminar.",
				options: [
					"was",
					"is",
					"were",
					"has been"
				],
				answer: 2,
				explanation: "With \"neither...nor\", the verb agrees with the nearer subject (\"students\" is plural → \"were\").",
				difficulty: "medium",
				topic: "Subject-Verb Agreement"
			},
			{
				id: "en5",
				text: "The committee consists ___ twelve experienced professors.",
				options: [
					"in",
					"of",
					"with",
					"from"
				],
				answer: 1,
				explanation: "\"Consist of\" means to be composed or made up of; \"consist in\" means to reside/lie in.",
				difficulty: "easy",
				topic: "Appropriate Preposition"
			}
		]
	},
	{
		id: "e7",
		name: "মেগা লাইভ মডেল টেস্ট-২০২৬ (অল সাবজেক্ট ফাইনাল)",
		courseId: "frbp",
		subject: "জীববিজ্ঞান রিভিশন",
		chapter: "রেচন প্রক্রিয়া ও বৃক্ক",
		type: "Model Test",
		minutes: 30,
		marks: 1,
		negative: .25,
		startTime: new Date(Date.now() + 2592e5).toISOString().slice(0, 16),
		endTime: new Date(Date.now() + 864e6).toISOString().slice(0, 16),
		retakeAllowed: false,
		published: true,
		instructions: ["এটি একটি নির্ধারিত সময়ের লাইভ মেগা পরীক্ষা।", "পরীক্ষা শুরুর কাউন্টডাউন শেষ হলেই অংশগ্রহণ করা যাবে।"],
		questions: [{
			id: "up1",
			text: "রক্তের pH স্বাভাবিক মাত্রা কত?",
			options: [
				"৬.৮–৭.০",
				"৭.৩৫–৭.৪৫",
				"৭.৮–৮.০",
				"৬.০–৬.৫"
			],
			answer: 1,
			explanation: "মানবদেহের ধমনীর রক্তের স্বাভাবিক pH মাত্রা ৭.৩৫ থেকে ৭.৪৫ (সামান্য ক্ষারীয়)।",
			difficulty: "easy",
			topic: "রক্ত ও সংবহন"
		}]
	}
];
export const SEEDED_LEADERBOARD: LeaderboardEntry[] = [
	{
		id: "lb1",
		examId: "e1",
		userName: "নাফিসা তাসনিম",
		batch: "SSC 26/27",
		score: 8,
		total: 8,
		correct: 8,
		totalQuestions: 8,
		accuracy: 100,
		timeSpentSeconds: 215
	},
	{
		id: "lb2",
		examId: "e1",
		userName: "রাফিউল করিম",
		batch: "SSC 26/27",
		score: 6.75,
		total: 8,
		correct: 7,
		totalQuestions: 8,
		accuracy: 88,
		timeSpentSeconds: 290
	},
	{
		id: "lb3",
		examId: "e1",
		userName: "সাবরিনা ইসলাম",
		batch: "SSC 26/27",
		score: 5.75,
		total: 8,
		correct: 6,
		totalQuestions: 8,
		accuracy: 75,
		timeSpentSeconds: 310
	},
	{
		id: "lb4",
		examId: "e2",
		userName: "তাহমিদ হাসান",
		batch: "SSC 26/27",
		score: 6,
		total: 6,
		correct: 6,
		totalQuestions: 6,
		accuracy: 100,
		timeSpentSeconds: 198
	},
	{
		id: "lb5",
		examId: "e2",
		userName: "নুসরাত জাহান",
		batch: "SSC 26/27",
		score: 4.75,
		total: 6,
		correct: 5,
		totalQuestions: 6,
		accuracy: 83,
		timeSpentSeconds: 245
	},
	{
		id: "lb6",
		examId: "e4",
		userName: "মাহমুদুল হক",
		batch: "GST 2025",
		score: 6,
		total: 6,
		correct: 6,
		totalQuestions: 6,
		accuracy: 100,
		timeSpentSeconds: 210
	},
	{
		id: "lb7",
		examId: "e4",
		userName: "ফারহানা আক্তার",
		batch: "GST 2025",
		score: 4.75,
		total: 6,
		correct: 5,
		totalQuestions: 6,
		accuracy: 83,
		timeSpentSeconds: 260
	},
	{
		id: "lb8",
		examId: "e5",
		userName: "আরিফুল ইসলাম",
		batch: "GST 2025",
		score: 5,
		total: 5,
		correct: 5,
		totalQuestions: 5,
		accuracy: 100,
		timeSpentSeconds: 230
	},
	{
		id: "lb9",
		examId: "e6",
		userName: "সুমাইয়া রহমান",
		batch: "SUST-RU-BUP",
		score: 4.75,
		total: 5,
		correct: 5,
		totalQuestions: 5,
		accuracy: 100,
		timeSpentSeconds: 175
	}
];
export const INITIAL_HISTORY: ExamResult[] = [{
	id: "seed_res_1",
	examId: "e3",
	name: "পদার্থবিজ্ঞান: গতি ও নিউটনের বলবিদ্যা ড্রিল",
	subject: "পদার্থবিজ্ঞান",
	courseId: "frpb",
	mode: "live",
	userName: "তানভীর আহমেদ",
	userEmail: "demo@lg.com",
	score: 3.75,
	total: 5,
	correct: 4,
	wrong: 1,
	skip: 0,
	accuracy: 80,
	timeSpentSeconds: 265,
	dateISO: (new Date(Date.now() - 1728e5)).toISOString(),
	answers: {
		0: 1,
		1: 1,
		2: 2,
		3: 2,
		4: 1
	},
	questionTimes: {
		0: 42,
		1: 58,
		2: 65,
		3: 62,
		4: 38
	},
	questions: DEFAULT_EXAMS[2].questions,
	violations: [],
	autoSubmitted: false
}, {
	id: "seed_res_2",
	examId: "e4",
	name: "GST হাই-ইয়েল্ড: কোষ ও এর গঠন (১ম পত্র)",
	subject: "জীববিজ্ঞান ১ম পত্র",
	courseId: "frb",
	mode: "live",
	userName: "তানভীর আহমেদ",
	userEmail: "demo@lg.com",
	score: 4.75,
	total: 6,
	correct: 5,
	wrong: 1,
	skip: 0,
	accuracy: 83,
	timeSpentSeconds: 310,
	dateISO: (new Date(Date.now() - 864e5)).toISOString(),
	answers: {
		0: 1,
		1: 2,
		2: 1,
		3: 1,
		4: 1,
		5: 2
	},
	questionTimes: {
		0: 45,
		1: 72,
		2: 40,
		3: 50,
		4: 55,
		5: 48
	},
	questions: DEFAULT_EXAMS[3].questions,
	violations: [],
	autoSubmitted: false
}];
