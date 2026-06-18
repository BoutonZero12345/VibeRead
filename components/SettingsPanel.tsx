"use client";

interface SettingsPanelProps {
  fontSize: number;
  setFontSize: (v: number) => void;
  lineHeight: number;
  setLineHeight: (v: number) => void;
  fontFamily: string;
  setFontFamily: (v: string) => void;
  columnWidth: number;
  setColumnWidth: (v: number) => void;
  textPadding: number;
  setTextPadding: (v: number) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  updateVal: (key: string, val: any, setter: Function) => void;
  panelClass: string;
  btnActive: string;
  btnInactive: string;
  lblColor: string;
  accentCls: string;
}

export default function SettingsPanel({
  fontSize, setFontSize, lineHeight, setLineHeight, fontFamily, setFontFamily,
  columnWidth, setColumnWidth, textPadding, setTextPadding,
  isDarkMode, setIsDarkMode, updateVal,
  panelClass, btnActive, btnInactive, lblColor, accentCls,
}: SettingsPanelProps) {
  return (
    <div className={`rounded-2xl p-5 w-full max-w-xs md:w-64 flex flex-col space-y-3.5 shadow-xl border transition-all duration-350 ${panelClass}`}>
      <div className="text-xs font-mono tracking-widest font-bold uppercase">Mise en page</div>
      <div className="space-y-1">
        <label className={`text-[10px] uppercase tracking-wider ${lblColor}`}>Theme</label>
        <div className="grid grid-cols-2 gap-1">
          <button onClick={() => updateVal("viberead_dark_mode", false, setIsDarkMode)} className={`px-2 py-0.5 text-xs rounded border transition-all ${!isDarkMode ? btnActive : btnInactive}`}>Clair</button>
          <button onClick={() => updateVal("viberead_dark_mode", true, setIsDarkMode)} className={`px-2 py-0.5 text-xs rounded border transition-all ${isDarkMode ? btnActive : btnInactive}`}>Sombre</button>
        </div>
      </div>
      <div className="space-y-1">
        <label className={`text-[10px] uppercase tracking-wider ${lblColor}`}>Style de police</label>
        <div className="grid grid-cols-3 gap-1">
          {["font-serif", "font-sans", "font-dyslexic"].map((f) => (
            <button key={f} onClick={() => updateVal("viberead_font_family", f, setFontFamily)} className={`px-1 py-0.5 text-[10px] rounded border transition-all ${f === "font-dyslexic" ? "font-dyslexic" : ""} ${fontFamily === f ? btnActive : btnInactive}`}>
              {f === "font-serif" ? "Serif" : f === "font-sans" ? "Sans" : "Dys"}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-0.5">
        <div className={`flex justify-between text-[10px] uppercase tracking-wider ${lblColor}`}><span>Taille</span><span className="font-bold">{fontSize}px</span></div>
        <input type="range" min="8" max="72" value={fontSize} onChange={(e) => updateVal("viberead_font_size", parseInt(e.target.value, 10), setFontSize)} className={`w-full rounded-lg appearance-none h-1 cursor-pointer ${accentCls}`} />
      </div>
      <div className="space-y-0.5">
        <div className={`flex justify-between text-[10px] uppercase tracking-wider ${lblColor}`}><span>Interligne</span><span className="font-bold">{lineHeight}</span></div>
        <input type="range" min="1.0" max="4.0" step="0.1" value={lineHeight} onChange={(e) => updateVal("viberead_line_height", parseFloat(e.target.value), setLineHeight)} className={`w-full rounded-lg appearance-none h-1 cursor-pointer ${accentCls}`} />
      </div>
      <div className="space-y-0.5">
        <div className={`flex justify-between text-[10px] uppercase tracking-wider ${lblColor}`}><span>Largeur</span><span className="font-bold">{columnWidth}px</span></div>
        <input type="range" min="200" max="1400" step="10" value={columnWidth} onChange={(e) => updateVal("viberead_column_width", parseInt(e.target.value, 10), setColumnWidth)} className={`w-full rounded-lg appearance-none h-1 cursor-pointer ${accentCls}`} />
      </div>
      <div className="space-y-0.5">
        <div className={`flex justify-between text-[10px] uppercase tracking-wider ${lblColor}`}><span>Marges</span><span className="font-bold">{textPadding}px</span></div>
        <input type="range" min="0" max="250" step="2" value={textPadding} onChange={(e) => updateVal("viberead_text_padding", parseInt(e.target.value, 10), setTextPadding)} className={`w-full rounded-lg appearance-none h-1 cursor-pointer ${accentCls}`} />
      </div>
    </div>
  );
}
