type RuleHintProps = {
  label: string;
  text: string;
};

export function RuleHint({ label, text }: RuleHintProps) {
  return (
    <details className="rounded-xl border border-accent/30 bg-card px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-accent">
        查看规则提示
      </summary>
      <div className="mt-3 border-t border-line pt-3">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="jp mt-1 text-sm leading-6">{text}</p>
        <p className="mt-2 text-xs text-muted">
          提示只说明变换规则，不显示本题最终答案。
        </p>
      </div>
    </details>
  );
}
