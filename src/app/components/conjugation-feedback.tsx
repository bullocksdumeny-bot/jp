import type { ConjugationFeedback as Feedback } from "@/lib/conjugation-feedback";

export function ConjugationFeedback({
  feedback,
}: {
  feedback: Feedback;
}) {
  return (
    <div className="mt-4 rounded-xl border border-current/15 bg-card/60 p-4">
      <p className="text-sm font-semibold">
        错误类型：{feedback.errorLabel}
      </p>
      <p className="mt-2 text-sm leading-6">{feedback.userReason}</p>
      <ol className="jp mt-4 space-y-2 text-sm leading-6">
        {feedback.steps.map((step, index) => (
          <li key={`${index}:${step}`}>
            {index > 0 && <span className="mr-2 text-accent">↓</span>}
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
