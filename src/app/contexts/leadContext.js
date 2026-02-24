"use client";
import React, { createContext, useContext, useState } from 'react';

/**
 * LeadContext — provides lead data to child components.
 * Fixed file name from leadontext → leadContext.
 */

const LeadContext = createContext(null);

function LeadProvider({ children }) {
    const [lead, setLead] = useState(null);

    return (
        <LeadContext.Provider value={{ lead, setLead }}>
            {children}
        </LeadContext.Provider>
    );
}

function useLead() {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error('useLead must be used within a LeadProvider');
    }
    return context;
}

export { LeadContext, LeadProvider, useLead };
