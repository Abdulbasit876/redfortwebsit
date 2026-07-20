interface SectionTitleProps {
  title: string; // Wrap words to highlight in braces: e.g., "We build {AI Solutions} that scale"
  subtitle?: string;
  centered?: boolean;
  light?: boolean; // If true, sets text color for dark backgrounds
  id?: string;
}

export function SectionTitle({ title, subtitle, centered = false, light = false, id }: SectionTitleProps) {
  // Parse title to extract curly braced text and render with red highlight
  const parseTitle = (text: string) => {
    const parts = text.split(/\{([^}]+)\}/g);
    return parts.map((part, index) => {
      // Odd indices are the captured groups inside braces
      if (index % 2 === 1) {
        return (
          <span key={index} className="text-red-600 font-bold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div
      id={id}
      className={`mb-12 max-w-3xl ${centered ? "mx-auto text-center" : "text-left"}`}
    >
      {subtitle && (
        <span className="block text-xs font-semibold uppercase tracking-widest text-red-600 mb-3 font-body">
          {subtitle}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight leading-tight ${
          light ? "text-white" : "text-black"
        }`}
      >
        {parseTitle(title)}
      </h2>
      <div
        className={`h-1 w-16 bg-red-600 mt-4 ${centered ? "mx-auto" : "mr-auto"}`}
      />
    </div>
  );
}
