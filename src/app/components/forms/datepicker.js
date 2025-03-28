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
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">
          {label}
          {required ? "*" : " (optional)"}
        </label>
        <Popover>
          <PopoverTrigger>
            {/* You can use an input or a button as the trigger */}
            <input
              type="text"
              value={selectedDate ? selectedDate.toLocaleDateString() : ""}
              placeholder={placeholder}
              readOnly
              className="placeholder:text-gray-600 placeholder:text-xs border-[1px] border-gray-300 p-2"
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2">
              <Calendar
                {...rest}
                ref={ref}
                name={name}
                value={selectedDate}
                onChange={handleDateChange} // When a date is selected
                className="border-[1px] border-gray-300 rounded-md"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

export default DatePickerComponent;
