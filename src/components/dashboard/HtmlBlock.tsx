'use client';

interface HtmlBlockProps {
  title?: string;
  content?: string;
}

const defaultContent = `
<h4 style="margin-top: 0; color: var(--text-secondary);">Welcome to your Learning Dashboard</h4>
<p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
  This is your personalised dashboard where you can track your courses,
  upcoming deadlines, and recent activity across the platform.
</p>
<p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
  <strong>Quick tips:</strong>
</p>
<ul style="color: var(--text-secondary); font-size: 13px; line-height: 1.8; padding-left: 20px;">
  <li>Star your favourite courses for quick access</li>
  <li>Check the Timeline block for upcoming deadlines</li>
  <li>Use the Calendar to plan your study schedule</li>
  <li>Visit the Forum to engage with your classmates</li>
</ul>
<p style="color: var(--text-muted); font-size: 12px;">
  Need help? Contact your course instructor or visit the
  <a href="/help" style="color: var(--moodle-primary);">Help Centre</a>.
</p>
`.trim();

export default function HtmlBlock({ title = 'Information', content }: HtmlBlockProps) {
  const htmlContent = content || defaultContent;

  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
        <h6 className="text-sm font-semibold m-0">{title}</h6>
      </div>
      <div
        className="p-3 text-sm"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
