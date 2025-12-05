interface InfoTooltipProps {
  text: string;
}

export default function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <div className="relative group">
      <span className="cursor-help text-white/40 hover:text-white/60 transition-colors">
        ⓘ
      </span>
      <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg border border-white/20 z-10">
        {text}
      </div>
    </div>
  );
}
