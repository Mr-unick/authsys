export default function TH({ children, type, classname }) {
    return (
        <td className={`px-5 py-3 text-start text-xs font-semibold text-slate-500 uppercase tracking-wide first-letter:uppercase ${classname}`}>
            {children}
        </td>
    );
}
