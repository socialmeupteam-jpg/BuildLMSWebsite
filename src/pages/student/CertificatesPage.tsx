import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { STUDENT_CERTIFICATES, STUDENT_ENROLLMENTS } from '../../data/mockData';
import { IconMedal, IconDownload, IconEye, IconExternalLink } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function CertificatesPage() {
  const { addToast } = useApp();
  const inProgress = STUDENT_ENROLLMENTS.filter(e => e.status === 'active');
  const completed = STUDENT_ENROLLMENTS.filter(e => e.status === 'completed');

  return (
    <DashboardLayout>
      <PageHeader title="My Certificates" subtitle="Download and verify your earned certificates" />

      {STUDENT_CERTIFICATES.length === 0 && (
        <EmptyState
          icon={<IconMedal size={32} />}
          title="No Certificates Yet"
          description="Complete a course with the required attendance and assessment scores to earn your certificate."
        />
      )}

      {/* Issued certificates */}
      {STUDENT_CERTIFICATES.map(cert => (
        <div key={cert.id} className="mb-6">
          <div
            className="relative overflow-hidden rounded-2xl border-2 border-[#007991]/20 p-8"
            style={{
              background: 'linear-gradient(135deg, #f0fbff 0%, #ffffff 50%, #fff8f0 100%)',
              boxShadow: '0 8px 32px rgba(0,121,145,0.1)',
            }}
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-48 h-48 opacity-5" style={{ transform: 'translate(20%, -20%)' }}>
              <IconMedal size={192} className="text-[#007991]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#007991] flex items-center justify-center">
                      <IconMedal size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#007991] uppercase tracking-wider">Certificate of Completion</p>
                      <p className="text-xs text-[#667085]">SocialMeUp Academy</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#667085] mb-1">This certifies that</p>
                  <p className="text-2xl font-bold text-[#1F2933] mb-1">Rahul Sharma</p>
                  <p className="text-xs text-[#667085] mb-1">has successfully completed</p>
                  <p className="text-xl font-bold text-[#007991] mb-4">{cert.courseTitle}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-[#667085]">
                    <div>
                      <p className="font-semibold text-[#1F2933]">Issue Date</p>
                      <p>{new Date(cert.issuedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2933]">Certificate No.</p>
                      <p className="font-mono text-[#007991]">{cert.certificateNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-[#E5E7EB] flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    {/* QR code placeholder */}
                    <div className="grid grid-cols-3 gap-0.5 p-2">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-sm ${[0,2,6,8,4].includes(i) ? 'bg-[#007991]' : 'bg-[#E6F4F6]'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[9px] text-[#9BA3AF] text-center">Scan to verify</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-[#E5E7EB]">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<IconDownload size={14} />}
                  onClick={() => addToast({ type: 'success', title: 'Certificate downloading…', message: 'PDF will be saved to your downloads folder.' })}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<IconExternalLink size={13} />}
                  onClick={() => addToast({ type: 'info', title: 'Verification page', message: cert.verificationUrl ?? '' })}
                >
                  Verify Online
                </Button>
                <StatusBadge status={cert.status} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* In-progress courses */}
      {inProgress.length > 0 && (
        <SectionCard title="In Progress — Certificate Pending">
          <div className="divide-y divide-[#F2F4F6]">
            {inProgress.map(enr => (
              <div key={enr.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={enr.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1F2933]">{enr.courseTitle}</p>
                  <p className="text-xs text-[#9BA3AF]">{enr.progress}% complete · {enr.lessonsCompleted}/{enr.totalLessons} lessons</p>
                  <div className="mt-1.5 h-1.5 bg-[#E6F4F6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#007991] progress-fill rounded-full" style={{ width: `${enr.progress}%` }} />
                  </div>
                </div>
                <Badge variant="neutral" dot>In Progress</Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </DashboardLayout>
  );
}
