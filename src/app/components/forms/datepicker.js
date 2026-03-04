import { forwardRef, useState } from "react";

import { Calendar } from "../../../components/components/ui/calendar"; // Import the calendar component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/components/ui/popover"; // Import Popover components

export const DatePickerComponent = forwardRef(
  ({ label, placeholder, name, required, value, ...rest }, ref) => {
    // Local state to track the selected date
    const [selectedDate, setSelectedDate] = useState(value || null);

    // Handler for changing the date
    const handleDateChange = (newDate) => {
      setSelectedDate(newDate);
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[13px] font-bold text-slate-700 ml-0.5">
          {label}{required ? <span className="text-red-500 ml-1">*</span> : <span className="text-slate-400 ml-1 text-[10px] font-medium tracking-tight">(optional)</span>}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-11 w-full px-4 border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-50/20 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-300 bg-white shadow-sm font-medium text-slate-600 flex items-center justify-start"
            >
              {selectedDate ? selectedDate.toLocaleDateString() : <span className="text-slate-300">{placeholder}</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 shadow-2xl">
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
