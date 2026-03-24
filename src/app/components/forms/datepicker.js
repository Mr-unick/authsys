import { forwardRef, useState } from "react";

import { Calendar } from "../../../components/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/components/ui/popover";

export const DatePickerComponent = forwardRef(
  ({ label, placeholder, name, required, value, ...rest }, ref) => {
    const [selectedDate, setSelectedDate] = useState(value || null);

    const handleDateChange = (newDate) => {
      setSelectedDate(newDate);
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-slate-600">
          {label}{required ? <span className="text-red-500 ml-0.5">*</span> : <span className="text-slate-400 ml-1 text-xs font-normal">(optional)</span>}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-10 w-full px-3.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors text-sm placeholder:text-slate-400 bg-white font-normal text-slate-700 flex items-center justify-start"
            >
              {selectedDate ? selectedDate.toLocaleDateString() : <span className="text-slate-400">{placeholder}</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-xl border-slate-200">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

export default DatePickerComponent;
