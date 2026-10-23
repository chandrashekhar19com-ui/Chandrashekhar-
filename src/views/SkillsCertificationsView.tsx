import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SkillCourse } from '../types';

export const SkillsCertificationsView: React.FC = () => {
  const { skillCourses, updateSkillCourseProgress, user } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<SkillCourse>(skillCourses[0]);
  const [showCertificateModal, setShowCertificateModal] = useState<SkillCourse | null>(null);

  const handleAdvanceModule = (courseId: string) => {
    updateSkillCourseProgress(courseId, 15);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171439] via-[#0f172a] to-[#0c1f38] border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> High-Impact Digital Competencies
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Skills &amp; Lifelong Learning Tracks
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Acquire industry-relevant programming, AI, data science, financial modeling, and academic writing proficiencies with structured milestone tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300">
            Portfolio Project Based
          </span>
        </div>
      </div>

      {/* Certification Regulatory Transparency Notice */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Certificate Transparency:</strong> Certificates generated upon track completion denote educational project completion verified by BrainRoot AI. They are designed for portfolio demonstrations and skill verification, not statutory degree equivalents.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skillCourses.map(course => (
          <div
            key={course.id}
            className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-900 text-cyan-400 border border-slate-800">
                  {course.domain}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> {course.durationHours} Hours
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">{course.title}</h3>
                <span className="text-[11px] text-slate-400 font-medium">Level: {course.level}</span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {course.skills.map(sk => (
                  <span
                    key={sk}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Modules breakdown */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Syllabus Highlights:
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {course.curriculumOverview.slice(0, 3).map((mod, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span className="line-clamp-1">{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Progress & Actions */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Track Progress</span>
                  <span className="text-cyan-400 font-bold">{course.progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleAdvanceModule(course.id)}
                  disabled={course.progressPercent >= 100}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{course.progressPercent >= 100 ? 'Course Completed ✓' : 'Practice Next Lab (+15%)'}</span>
                </button>

                {course.progressPercent >= 100 ? (
                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(course)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400">
                    Finish track for certificate
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-[#060a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#0e1628] border-2 border-amber-500/50 p-8 space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 mx-auto flex items-center justify-center text-slate-950 shadow-xl">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                BrainRoot AI • Educational Completion Credential
              </span>
              <h2 className="text-2xl font-black text-white">
                Certificate of Mastery
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <p className="text-xs text-slate-400">This certificate is awarded to</p>
              <p className="text-xl font-extrabold text-cyan-300">{user.name}</p>
              <p className="text-xs text-slate-300">
                for successfully completing the rigorous project curriculum and assessment in:
              </p>
              <p className="text-base font-bold text-white">{showCertificateModal.title}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-4 pt-2">
              <span>Platform Creator: <strong>Chandrashekhar Singh</strong></span>
              <span>Issue Date: <strong>{new Date().toLocaleDateString()}</strong></span>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  alert('Certificate image saved to your downloads!');
                  setShowCertificateModal(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Credential</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
