

'use client';

import { createContext, useState ,useContext } from 'react';

export const LeadContext = createContext();

export function LeadProvider({ children }) {

  const [lead, setLead] = useState(null);

  const value = { lead,setLead};

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
}



